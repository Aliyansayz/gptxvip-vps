import React from "react";
import { motion } from "motion/react";
import { SingleTradeView } from "./SingleTradeView";
import { MultipleTradeView } from "./MultipleTradeView";
import { BreakevenView } from "./BreakevenView";
import { HedgeTradeView } from "./HedgeTradeView";
import { OHLCData, PriceData } from "../types";

interface TradeTypeViewProps {
  silverCandlestickData: OHLCData[];
  chart2Data: PriceData[];
  candlestickData: OHLCData[];
}

export const TradeTypeView: React.FC<TradeTypeViewProps> = ({
  silverCandlestickData,
  chart2Data,
  candlestickData,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-24 pb-16"
    >
      <header className="max-w-3xl space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">Finhub · execution models</p>
        <h1>Trade execution patterns</h1>
        <p className="text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Compare four ways to manage entries, exits, and exposure. Each section pairs an illustrative chart with the rules behind that pattern.
        </p>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Charts use generated example prices; they are not live market quotes.</p>
      </header>
      <section id="single" aria-label="One trade at a time example" className="scroll-mt-24">
        <SingleTradeView candlestickData={silverCandlestickData} />
      </section>
      <section id="multiple" aria-label="Multiple trades example" className="scroll-mt-24">
        <MultipleTradeView candlestickData={candlestickData} />
      </section>
      <section id="breakeven" aria-label="Breakeven and partial position example" className="scroll-mt-24">
        <BreakevenView candlestickData={candlestickData} />
      </section>
      <section id="hedge" aria-label="Hedge trade example" className="scroll-mt-24">
        <HedgeTradeView chartData={chart2Data} />
      </section>
    </motion.div>
  );
};
