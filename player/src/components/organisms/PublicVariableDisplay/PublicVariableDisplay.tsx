import { observer } from "mobx-react-lite";
import css from "./PublicVariableDisplay.module.scss";
import { useContext, useState } from "react";
import { AppContext } from "../../../stores/AppContext.ts";
import { ApplicationVariableType } from "@shared/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "@shared/animations";

export const PublicVariableDisplay = observer(() => {
  const { PlayerStore } = useContext(AppContext);
  const variables = PlayerStore.getPublicVariables();

  const [statsOpen, setStatsOpen] = useState(false);

  function toggleStats() {
    setStatsOpen(!statsOpen);
  }

  return (
    <FadeIn
      className={`${css.publicVariableDisplay} ${statsOpen ? css.open : css.closed}`}
    >
      <div className={css.toggle} onClick={toggleStats}>
        <FontAwesomeIcon icon={["fas", "dice-d20"]} />{" "}
        <span>{statsOpen ? "Hide" : "Show"}&nbsp;Stats</span>
      </div>
      <AnimatePresence>
        {statsOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className={css.variables}>
              {variables.map((v) => {
                return (
                  <div key={v.id} className={css.variable}>
                    {v.name}:{" "}
                    {v.type === ApplicationVariableType.NUMBER
                      ? new Intl.NumberFormat().format(v.value as number)
                      : v.value.toString()}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </FadeIn>
  );
});
