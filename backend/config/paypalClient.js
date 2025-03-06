import paypal from "@paypal/checkout-server-sdk";

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const payPalClient = new paypal.core.PayPalHttpClient(environment);

// console.log("🔹 PAYPAL_CLIENT_ID:", process.env.PAYPAL_CLIENT_ID);
// console.log("🔹 PAYPAL_SECRET:", process.env.PAYPAL_CLIENT_SECRET ? "Loaded" : "Not Loaded");


export default payPalClient; // ✅ Use `export default` for ES Modules
