# Disjunction System Features

+ **Active System Mode:** Disjunction System
+ **Logical Operator Integration:** Utilizes an `OR` operator between multiple active classic systems, abstracting their signals logically to trigger an entry.
+ **Flexible System Selection:** Allows using as many available systems as desired. A signal is generated if *any* of the selected systems triggers an entry condition in the given direction.
+ **Independent Configurations:** Each selected system has its own distinct panel for configuring its specific parameters and data sources.
+ **System Panel:** Features a unique 'Disjunction System Panel' that displays all active systems being monitored for potential entry signals.
+ **Single System Behavior:** When only one system is active in the Disjunction system, it functions identically to a classic system, relying solely on its individual entry criteria (e.g., crossover state).
+ **Multi-System Disjunction (OR logic):** When two or more systems are active, a trade entry is triggered the moment *at least one* of the configured systems signals an entry, independent of the alignment or correlation of the other systems.
+ **Opposite Signals:** If LONG and SHORT arrive on the same candle, the first selected system takes priority. No selected systems means no entry signal.
+ **Aggregated Sources:** Beta and delta signals are consumed when their candle closes, once per source candle.
+ **Self Replication Mode Support:** Allows replication of a single system (e.g., Supertrend Regime) multiple times to behave as independent systems allowing distinct parameters and data sources, which can then trigger an entry if any of the replicated criteria are met.

+ **Enable Disjunction System Mode type also for exit rule section**
