import React, { useState, useEffect } from "react";
import { GiCancel } from "react-icons/gi";
import Meta from "../Components/Meta";
import Hero from "../Components/Hero";
import How from "../Components/How";
import Options from "../Components/Options";
import PaymentModal from "../Components/Payment";
import HowData from "../data/how";
import BuyOptionsData from "../data/buy_options";
import styles from "../styles/Buy_coffee.module.scss";

const totalHowCards = () => {
  const cards = [];
  for (let i = 0; i < HowData.data.length - 1; i++) {
    cards.push(
      <div className={styles.line} key={i} />,
      <div className={styles.circle} key={i + 2} />
    );
  }
  return cards;
};

export default function Buy_coffee() {
  // Default key value for the options according to BuyOptionsData
  const keyIDs = [];
  const valueIDs = [];
  let defaultValues;

  BuyOptionsData.data.map((item) => {
    keyIDs.push(item.data[0].id);
    valueIDs.push("");
  });

  const result = valueIDs.reduce(function (result, field, index) {
    result[keyIDs[index]] = field;
    defaultValues = result;
    return result;
  }, {});

  const [coffee, setCoffee] = useState(result);
  const [showClearAll, setShowClearAll] = useState(false);
  const [canBuy, setCanBuy] = useState(false);
  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);

  const closeModel = () => {
    setOpenSummaryModal(false);
    setOpenPaymentModal(false);
  };

  useEffect(() => {
    if (JSON.stringify(coffee) !== JSON.stringify(result) && !canBuy) {
      const coffeeValues = Object.values(coffee);
      setCanBuy(coffeeValues.filter(Boolean).length === coffeeValues.length);
    }
  }, [coffee, result, canBuy]);

  return (
    <>
      <Meta />
      <main>
        <Hero
          title="Buy Coffee"
          description="We are best in business buy fresh and rich coffee from Us!"
        />

        <section className={styles.how_container}>
          <div className={styles.how_illustration}>
            <div className={styles.circle} />
            {totalHowCards()}
          </div>

          <div className={styles.how_card_container}>
            {HowData.data.map((data, key) => (
              <How key={key} {...data} />
            ))}
          </div>
        </section>

        <section className={styles.buy_options_container}>
          <aside className={styles.buy_options_menu}>
            <ul>
              {BuyOptionsData.data.map((menu, key) => (
                <li
                  className={
                    coffee[menu.data[0].id] === "" ? "" : "li_selected"
                  }
                  key={key}
                >
                  <span>{key + 1}</span> {menu.option}
                </li>
              ))}
            </ul>
          </aside>

          <div className={styles.buy_options_card_container}>
            {(JSON.stringify(coffee) !== JSON.stringify(defaultValues) ||
              showClearAll) && (
              <div
                className={styles.clear_all_button}
                onClick={() => {
                  setCoffee(defaultValues);
                  setShowClearAll(false);
                  setCanBuy(false);
                }}
              >
                <GiCancel size={30} />
                <a>Clear</a>
              </div>
            )}
            {BuyOptionsData.data.map((option, key) => (
              <Options
                key={key}
                question={option.question}
                options={option.data}
                setSelected={(value) => {
                  setCoffee({ ...coffee, ...value });
                }}
                selected={coffee}
              />
            ))}
            <div>
              <button
                disabled={!canBuy}
                className="button-primary"
                onClick={() => {
                  setOpenSummaryModal(true);
                }}
              >
                Buy Coffee!
              </button>
            </div>
          </div>
        </section>

        {openSummaryModal && (
          <div className={styles.modal_summary_page_container}>
            <div className={styles.modal_summary_container}>
              <div className={styles.modal_summary_header}>
                <h2>Order Summary</h2>
                <div
                  className={styles.clear_all_button}
                  onClick={() => {
                    setOpenSummaryModal(false);
                  }}
                >
                  <GiCancel size={30} />
                </div>
              </div>
              <div className={styles.modal_summary_content}>
                <p className={styles.modal_summary_details}>
                  Is this correct? You can proceed to checkout or go back to
                  plan selection.
                </p>
                <div className={styles.modal_summary_checkout}>
                  <p>$49.99</p>
                  <button
                    className="button-primary"
                    onClick={() => setOpenPaymentModal(true)}
                  >
                    Checkout
                  </button>
                </div>
                <button
                  className="button-primary mobile_only"
                  onClick={() => setOpenPaymentModal(true)}
                >
                  Checkout - $49.99
                </button>
                <button
                  className="button-secondary"
                  onClick={() => {
                    setOpenSummaryModal(false);
                  }}
                >
                  Change Order
                </button>
              </div>
            </div>
          </div>
        )}
        {openPaymentModal && (
          <div className={styles.modal_summary_page_container}>
            <PaymentModal onClick={closeModel} />
          </div>
        )}
      </main>
    </>
  );
}
