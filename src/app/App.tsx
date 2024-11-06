import { DynamicForm, Schema } from "./components/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

const A: Schema = {
  username: { type: "string", min: 5, required: true, max: 20 },
  age: { type: "number", required: true, min: 0 },
  email: { type: "string", required: true },
  bio: { type: "string", multiline: true },
  newsletter: { type: "boolean", required: true },
  address: {
    type: "object",
    params: {
      street: { type: "string", required: true },
      city: { type: "string", required: true },
      zipcode: { type: "string", required: true },
    },
  },
  gender: {
    type: "category",
    options: ["male", "female", "other"],
    required: true,
  },
  profile_visibility: { type: "boolean", required: true },
};

const B: Schema = {
  account_name: { type: "string", min: 5, required: true },
  storage_limit: { type: "number", required: true },
  is_active: { type: "boolean", required: true },
  contact_email: { type: "string", required: true },
  backup_enabled: { type: "boolean", required: true },
  notification_settings: {
    type: "object",
    params: {
      email_notifications: { type: "boolean", required: true },
      sms_notifications: { type: "boolean" },
      push_notifications: { type: "boolean" },
    },
  },
  account_type: {
    type: "category",
    options: ["basic", "premium", "enterprise"],
    required: true,
  },
  subscription_status: { type: "boolean", required: true },
};

const C: Schema = {
  app_name: { type: "string", min: 3, required: true },
  version: { type: "string", required: true },
  enable_logs: { type: "boolean", required: true },
  max_users: { type: "number", required: true },
  support_email: { type: "string", required: true },
  features: {
    type: "object",
    params: {
      feature_a: { type: "boolean", required: true },
      feature_b: { type: "boolean" },
      feature_c: { type: "boolean" },
    },
  },
  config_feature_a: {
    type: "object",
    params: {
      config_a: { type: "string", required: true },
      config_b: { type: "string" },
    },
    visibility: ["features.feature_a", "eq", true],
  },
  config_feature_b: {
    type: "object",
    params: {
      config_c: { type: "string", required: true },
      config_d: { type: "string" },
    },
    visibility: ["features.feature_b", "eq", true],
  },
  config_feature_c: {
    type: "object",
    params: {
      config_c: { type: "string", required: true },
      config_d: { type: "string" },
    },
    visibility: ["features.feature_c", "eq", true],
  },

  environment: {
    type: "category",
    options: ["development", "staging", "production"],
    required: true,
  },
  auto_update: { type: "boolean", required: true },
};

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4">
      <Tabs defaultValue="A" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="A">Schema A</TabsTrigger>
          <TabsTrigger value="B">Schema B</TabsTrigger>
          <TabsTrigger value="C">Schema C</TabsTrigger>
        </TabsList>
        <TabsContent value="A">
          <DynamicForm schema={A} />
        </TabsContent>
        <TabsContent value="B">
          <DynamicForm schema={B} />
        </TabsContent>
        <TabsContent value="C">
          <DynamicForm schema={C} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
