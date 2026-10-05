import type { ManualDefinition } from "../components/manualTypes";

export const manual: ManualDefinition = {
  "title": "ColdChain ERP",
  "category": "OPERATIONS / DISTRIBUTION",
  "subtitle": "Keep batch history, expiry, delivery, and reconciliation connected.",
  "introduction": "Follow receiving, FEFO inventory, route sales, delivery, and day-end close. Apply the product-specific handling requirements recorded by your operation.",
  "highlights": [
    "Receive and track batches",
    "Pick by expiry and condition",
    "Reconcile routes and close"
  ],
  "sections": [
    {
      "id": "receive",
      "title": "Receive and identify the batch",
      "summary": "Traceability starts before stock becomes available for dispatch.",
      "steps": [
        "Match the delivery to its receiving record and inspect item identity, quantity, packaging, and batch details.",
        "Record lot or batch identifiers, expiry dates, receiving time, and required condition checks.",
        "Compare recorded handling conditions with the applicable product requirements.",
        "Separate discrepancies or questionable stock for review instead of treating it as available inventory."
      ],
      "outcome": "Each received quantity has a batch, expiry, condition record, and receiving outcome."
    },
    {
      "id": "store",
      "title": "Store stock and monitor conditions",
      "summary": "Keep inventory records aligned with the physical handling of the product.",
      "steps": [
        "Assign an appropriate storage location using the item’s recorded handling requirements.",
        "Record inventory by item, batch, expiry, location, and availability status.",
        "Track condition checks and link an excursion or hold to the affected batches.",
        "Reconcile transfers and adjustments with their reason and authorizing record."
      ],
      "outcome": "The available balance and condition status can be traced to a location and batch."
    },
    {
      "id": "pick",
      "title": "Plan orders and pick by FEFO",
      "summary": "First-expiring-first-out is useful only when the stock is eligible for the order.",
      "steps": [
        "Review order requirements, available stock, expiry dates, and any customer acceptance constraints.",
        "Select eligible stock in expiry order and exclude held, unsuitable, or otherwise restricted batches.",
        "Record the batch quantities allocated to each order.",
        "Check shortages, substitutions, and discrepancies before releasing the pick."
      ],
      "outcome": "The order has a checked allocation with a clear expiry and batch trail."
    },
    {
      "id": "dispatch",
      "title": "Prepare and dispatch the route",
      "summary": "Keep dispatch details with the order and the stock movement.",
      "steps": [
        "Check picked quantities against the order and record the dispatch batch identifiers.",
        "Confirm the handling and transport requirements relevant to the product and route.",
        "Record the assigned route, delivery locations, dispatch time, and responsible operator.",
        "Carry forward any approved change or exception with its supporting record."
      ],
      "outcome": "Dispatch records explain what left inventory, where it is going, and who is responsible."
    },
    {
      "id": "deliver",
      "title": "Record delivery, returns, and route sales",
      "summary": "The route record should distinguish delivered stock from returns and other exceptions.",
      "steps": [
        "Capture delivered quantities, receipt details, and relevant condition evidence.",
        "Record rejected, undelivered, or returned quantities with batch identifiers and reasons.",
        "Route returned stock through the applicable inspection and disposition process before making it available again.",
        "Connect route sales, invoices, receipts, and stock movements to the delivery record."
      ],
      "outcome": "The route has a consistent account of delivered, returned, and unresolved quantities."
    },
    {
      "id": "close",
      "title": "Reconcile the day and preserve lineage",
      "summary": "Day-end close connects physical stock, route records, and financial records.",
      "steps": [
        "Reconcile opening stock, receipts, transfers, dispatches, returns, and closing stock.",
        "Compare route deliveries and sales with invoices, payments, and outstanding balances.",
        "Investigate variances and record adjustments with the required owner and approval.",
        "Retain the receiving-to-delivery batch trail, condition records, and unresolved follow-up tasks."
      ],
      "outcome": "The day’s balances reconcile or have clearly assigned, documented exceptions."
    }
  ],
  "illustrations": [
    
  ]
};
