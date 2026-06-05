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
      className="space-y-32"
    >
      <div id="single">
        <SingleTradeView candlestickData={silverCandlestickData} />
      </div>
      <div id="multiple">
        <MultipleTradeView candlestickData={candlestickData} />
      </div>
      <div id="breakeven">
        <BreakevenView candlestickData={candlestickData} />
      </div>
      <div id="hedge">
        <HedgeTradeView />
      </div>
    </motion.div>
  );
};
