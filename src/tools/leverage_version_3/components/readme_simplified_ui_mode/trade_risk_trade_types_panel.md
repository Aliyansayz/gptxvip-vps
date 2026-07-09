

Phase 1: Risk Allocation Models

Before defining execution behavior, the system needs to lock in the exact capital exposure allowed per position.
UI Elements:

    Main Trade Risk Model: A split-control module defining the initial entry risk.

        Type Selector: Percentage of Equity (e.g., 1.0%), Fixed Cash Amount (e.g., $1,000), or Fixed Lot/Contract Size (e.g., 2.0 Lots).

        Max Loss Cap: A strict safety ceiling numerical input.

    Recurrent Trade Risk Model: Controls the sizing for secondary entries, add-ons, or scale-ins (e.g., grid trading or martingales).

        Scaling Multiplier: Multiplier input (e.g., 1.0x for equal size, 2.0x for doubling down, 0.5x for conservative scaling).

        Maximum Cumulative Risk: A hard stop ceiling for the entire trade cluster (e.g., "Do not exceed 5% total portfolio exposure across all recurrent trades").

Phase 2: Recurrent Behavior & Execution Logic

This phase dictates the automation rules—how and when the system is allowed to stack secondary positions onto an open live trade.
UI Elements:

    Recurrent Trade Activation: A prominent master switch.

        [X] Enable Recurrent Trading (Scale-Ins / Grid / Pyramiding)

    Recurrent Conditions Panel (Conditional): Triggers that dictate when a new position fires.

        Directional Trigger: [ Averaging Down (Loss) ] / [ Pyramiding Up (Profit) ]

        Step Distance Type: Fixed Pips/Ticks, Percentage Drop, or Volatility-based (e.g., 1.5x ATR).

    Behavior Lifecycle Settings: Rules governing how these positions act together.

        TP/SL Behavior Toggle:

            Average Price Mode: Recalculate a single collective break-even and trailing stop for the entire basket of trades.

            Independent Mode: Every individual recurrent trade retains its own isolated stop-loss and take-profit targets.

        Max Open Orders Field: Numeric ceiling limiting total concurrent active sub-positions (e.g., Max 4 scales-ins).


Recurrent Trade Behavior (The "How"): Rules governing how open positions interact with one another.

    Stop Loss Management Options:

        Independent: Each recurrent trade keeps its own isolated stop loss.

        Average Break-Even: The system shifts the Stop Loss of all open trades to the collective average net break-even price.

    Close-Out Automation:

        [ ] Close all recurrent trades if Main Trade hits Stop Loss.