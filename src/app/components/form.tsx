import React, { useState, ChangeEvent } from "react";
import { Input } from "./ui/input";
import { Card, CardContent, CardFooter } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

type VisibilityCondition = [
  string,
  "eq" | "neq" | "gt" | "lt" | "gte" | "lte",
  any
];

type FieldSchema =
  | {
      type: "string";
      multiline?: boolean;
      min?: number;
      max?: number;
      visibility?: VisibilityCondition;
      required?: boolean;
    }
  | {
      type: "number";
      visibility?: VisibilityCondition;
      min?: number;
      max?: number;
      required?: boolean;
    }
  | { type: "boolean"; visibility?: VisibilityCondition; required?: boolean }
  | {
      type: "category";
      options: string[];
      visibility?: VisibilityCondition;
      required?: boolean;
    }
  | {
      type: "object";
      params: Schema;
      visibility?: VisibilityCondition;
    };

export type Schema = { [key: string]: FieldSchema };

interface FormFieldProps {
  fieldKey: string;
  fieldSchema: FieldSchema;
  value: any;
  onChange: (key: string, value: any) => void;
  errors: { [key: string]: string };
}

const FormField: React.FC<FormFieldProps> = ({
  fieldKey,
  fieldSchema,
  value,
  onChange,
  errors,
}) => {
  const renderField = () => {
    switch (fieldSchema.type) {
      case "string":
        if (fieldSchema.multiline) {
          return (
            <Textarea
              onChange={(e: ChangeEvent<any>) =>
                onChange(fieldKey, e.target.value.trim())
              }
            />
          );
        }
        return (
          <Input
            onChange={(e: ChangeEvent<any>) =>
              onChange(fieldKey, e.target.value.trim())
            }
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={value || ""}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(fieldKey, e.target.value)
            }
          />
        );
      case "boolean":
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChange(fieldKey, e.target.checked)
            }
          />
        );
      case "category":
        return (
          <Select
            value={value || ""}
            onValueChange={(value) => onChange(fieldKey, value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fieldSchema.options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "object":
        return (
          <div className="mb-4 pl-4 border-border border-l">
            {Object.keys(fieldSchema.params).map((key) => (
              <FormField
                key={key}
                fieldKey={`${fieldKey}.${key}`}
                fieldSchema={fieldSchema.params[key]}
                value={value ? value[key] : ""}
                onChange={(subKey, val) => {
                  const newValue = {
                    ...value,
                    [subKey.split(".").pop()!]: val,
                  };
                  onChange(fieldKey, newValue);
                }}
                errors={errors}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <label className="block font-semibold mb-2">
        {fieldKey.split(".").pop()}
        {"required" in fieldSchema && fieldSchema.required && (
          <span className="text-red-500">*</span>
        )}
      </label>
      {renderField()}
      {errors[fieldKey] && <p className="text-red-500">{errors[fieldKey]}</p>}
    </div>
  );
};

interface DynamicFormProps {
  schema: Schema;
}

const generateInitialValues = (schema: Schema): { [key: string]: any } => {
  const values: { [key: string]: any } = {};

  Object.keys(schema).forEach((key) => {
    const fieldSchema = schema[key];

    if (fieldSchema.type === "object") {
      values[key] = generateInitialValues(fieldSchema.params);

      if (Object.keys(values[key]).length === 0) {
        delete values[key];
      }
    } else if (fieldSchema.type === "boolean") {
      values[key] = false;
    }
  });

  return values;
};

export const DynamicForm = ({ schema }: DynamicFormProps) => {
  const [formData, setFormData] = useState(generateInitialValues(schema));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => {
      const newData = { ...prev };
      const keys = key.split(".");
      let temp = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!temp[keys[i]]) temp[keys[i]] = {};
        temp = temp[keys[i]];
      }
      temp[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleSubmit = () => {
    const newErrors = getErrors(schema, formData);

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Form submitted successfully!");
    }
  };

  const shouldRenderField = (fieldKey: string, fieldSchema: FieldSchema) => {
    if (fieldSchema.visibility) {
      return evaluateCondition(fieldSchema.visibility, formData);
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="flex flex-col gap-2 py-2">
          {Object.keys(schema).map(
            (key) =>
              shouldRenderField(key, schema[key]) && (
                <FormField
                  key={key}
                  fieldKey={key}
                  fieldSchema={schema[key]}
                  value={formData[key]}
                  onChange={handleChange}
                  errors={errors}
                />
              )
          )}
        </CardContent>
        <CardFooter>
          <Button type="button" onClick={handleSubmit}>
            Submit
          </Button>
        </CardFooter>
      </Card>
      <pre className="mt-4 bg-gray-100 p-4 overflow-auto">
        Values: <br />
        {JSON.stringify(formData, null, 2)}
      </pre>
      <pre className="mt-4 bg-gray-100 p-4 overflow-auto">
        Errors:
        <br />
        {JSON.stringify(errors, null, 2)}
      </pre>
      <pre className="mt-4 bg-gray-100 p-4 overflow-auto">
        Is valid
        <br />
        {Object.keys(validateSchema(schema, formData)).length === 0
          ? "true"
          : "false"}
      </pre>
    </form>
  );
};

const getErrors = (
  schema: Schema,
  values: { [key: string]: any }
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  Object.keys(schema).forEach((key) => {
    const fieldSchema = schema[key];
    const value = values[key];

    if (
      fieldSchema.visibility &&
      !evaluateCondition(fieldSchema.visibility, values)
    ) {
      return;
    }

    const result = validateField(fieldSchema, value, values);

    if (typeof result === "string") {
      errors[key] = result;
    } else if (typeof result === "object") {
      Object.keys(result).forEach((nestedKey) => {
        errors[`${key}.${nestedKey}`] = result[nestedKey];
      });
    }
  });

  return errors;
};

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const evaluateCondition = (
  condition: VisibilityCondition,
  values: { [key: string]: any }
) => {
  const [dependency, operator, value] = condition;
  const dependencyValue = getNestedValue(values, dependency);

  switch (operator) {
    case "eq":
      return dependencyValue === value;
    case "neq":
      return dependencyValue !== value;
    case "gt":
      return dependencyValue > value;
    case "lt":
      return dependencyValue < value;
    case "gte":
      return dependencyValue >= value;
    case "lte":
      return dependencyValue <= value;
    default:
      return false;
  }
};

const validateField = (
  fieldSchema: FieldSchema,
  value: any,
  values: Record<string, any>
): string | Record<string, string> | undefined => {
  if (
    fieldSchema.visibility &&
    !evaluateCondition(fieldSchema.visibility, values)
  ) {
    return;
  }

  const isRequired = "required" in fieldSchema && fieldSchema.required;

  if (isRequired && (value === null || value === undefined || value === "")) {
    return "This field is required";
  }

  switch (fieldSchema.type) {
    case "string":
      if (!isRequired && !value) return;
      if (typeof value !== "string") return "Invalid value";
      if (fieldSchema.min !== undefined && value.length < fieldSchema.min)
        return `Minimum length is ${fieldSchema.min}`;
      if (fieldSchema.max !== undefined && value.length > fieldSchema.max)
        return `Maximum length is ${fieldSchema.max}`;
      return;
    case "number":
      if (!isRequired && !value) return
      const isNumber = !isNaN(+value);
      if (!isNumber) return "Invalid value";
      if (fieldSchema.min !== undefined && value < fieldSchema.min)
        return `Minimum value is ${fieldSchema.min}`;
      if (fieldSchema.max !== undefined && value > fieldSchema.max)
        return `Maximum value is ${fieldSchema.max}`;
      return;
    case "boolean":
      if (typeof value !== "boolean") return "Invalid value";
      return;
    case "category":
      if (!isRequired && !value) return;
      if (!fieldSchema.options.includes(value)) return "Invalid value";
      return;
    case "object":
      const result = validateSchema(fieldSchema.params, value ?? {});

      if (Object.keys(result).length === 0) {
        return;
      }

      return result;
  }
};

const validateSchema = (
  schema: Schema,
  values: { [key: string]: any }
): Record<string, string> => {
  return Object.keys(schema).reduce((acc, key) => {
    const fieldSchema = schema[key];
    const value = values[key];
    const error = validateField(fieldSchema, value, values);

    if (typeof error === "string") {
      acc[key] = error;
    } else if (typeof error === "object") {
      Object.keys(error).forEach((nestedKey) => {
        acc[`${key}.${nestedKey}`] = error[nestedKey];
      });
    }

    return acc;
  }, {} as Record<string, string>);
};
