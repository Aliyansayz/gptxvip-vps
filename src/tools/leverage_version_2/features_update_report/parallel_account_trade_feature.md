# Parallel Account Trade Feature

## Overview
This document outlines the proposed mechanics and UI/UX for the "Parallel Account" feature within the Leverage Trading Version 2 system. This feature allows users to simulate and manage multiple concurrent trading accounts (A1, A2, A3, etc.) executing distinct but related strategies based on a primary account's signals.

## UI/UX Integration

### Configuration Panel
A new tab named **"Account Settings"** will be introduced inside the Configuration Panel. 

* In new tab we have a new toggle switch that allows adding new accounts that are parallel to root **"Parallel Account"** will be introduced inside the Configuration Panel. 
* Add a new account using a counter with max value is 15.
* A reset button that resets their settings and a delete all button too. plus individual delete button too.  

This tab will contain a dynamic list of rectangular grid cards representing each account:
*   **A1 (Normal Account):** The default, primary account. Its settings act as the master configuration.
*   **A2, A3, A4, A5, etc.:** Clone accounts that can be added dynamically by the user.

### Cloning Mechanism
When a new parallel account (e.g., A2) is created, it will by default clone and follow the base settings of the A1 master account. 

### Account Grid Interface
Each account card (A2 and onwards) will feature dropdowns and toggles to independently modify its behavior relative to the A1 signals.

## Changeable Parameters per Parallel Account

Each parallel account will have the following configurable parameters:

### 1. Simultaneous Trade State
*   **Toggle:** On / Off
*   **Description:** Determines if this parallel account should actively execute trades when the A1 account generates an entry signal. 
*   **Trade Log Book Integration:** If toggled "On", trades executed by this parallel account will be visible and annotated (e.g., "[A2]") within the global Trade Log Book alongside A1 trades.

### 2. Trade Execution Mode
A dropdown selecting how the account interprets the A1 executing signal, allowing for varied directional strategies:

*   **Normal Mode:**
    *   Executes the trade in the exact same direction as the A1 account.
    *   *Example: A1 goes LONG with 1 Lot -> Parallel Account goes LONG with 1 Lot.*

*   **Hedge Mode:**
    *   Splits the position size to hedge against the primary signal.
    *   *Example: A1 goes LONG with 1 Lot -> Parallel Account executes 0.5 Lot SHORT and 0.5 Lot LONG.*

*   **Invert Mode:**
    *   Executes the trade fully in the opposite direction of the A1 account's signal.
    *   *Example: A1 goes LONG with 1 Lot -> Parallel Account goes SHORT with 1 Lot.*

### Key Considerations
Ensure following aspects are obeyed:
   * When Account is On it strictly follows and execute trades with same lot size as the root account.
   * When trade is executed it is being reflected 
   * When Parallel Accounts are active their main trades gets executed 
   * Also the recurrent trades of A2, A3, and so on also. 

## Future Implementation Considerations
*   **Trade State Syncing:** The simulator loop needs to iterate through all active parallel accounts when an entry signal is validated for A1, applying the specific execution logic (Normal, Hedge, Invert) before adding them to the global trades array.
*   **PnL Tracking:** Each account will need distinct tracking for its balance, free margin, and active PnL. Accounts might require an `accountId` attached to their `Trade` objects.
