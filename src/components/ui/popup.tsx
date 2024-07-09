"use client";
import React, { Component } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { Lock } from "lucide-react";

interface PopupInstance {
  setState: React.Component<any, { isOpen: boolean }>["setState"];
}

class PopupManager {
  private instance: PopupInstance | null = null;
  public message: string;
  constructor() {
    this.message = "Add exclusive content and control who can access";
  }

  setInstance(instance: PopupInstance, message: string) {
    this.instance = instance;
    this.message = message || this.message;
  }

  show() {
    if (this.instance) {
      document.body.style.overflow = "hidden";
      this.instance.setState({ isOpen: true });
    }
  }

  hide() {
    if (this.instance) {
      document.body.style.overflow = "";
      this.instance.setState({ isOpen: false });
    }
  }

  updateMessage(msg: string) {
    this.message = msg;
  }
}

export const popup = new PopupManager();

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.75 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.75 },
};

interface PopupProps {}

interface PopupState {
  isOpen: boolean;
}

class Popup extends Component<PopupProps, PopupState> {
  constructor(props: PopupProps) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  componentDidMount() {
    popup.setInstance(this as PopupInstance, "");
  }

  render() {
    const { isOpen } = this.state;

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={{
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
            }}
            className="fixed inset-0 flex z-50 items-center justify-center bg-black bg-opacity-50"
            variants={backdropVariants}
            onClick={(e) => (
              e.stopPropagation(),
              (document.body.style.overflow = ""),
              this.setState({ isOpen: false })
            )}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="bg-neutral-900 p-8 rounded-xl max-w-md shadow-lg border"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-pretty gap-2.5 max-w-xs">
                <Lock className="h-11 w-11" />
                <p>{popup.message}</p>
                <Button
                  size="sm"
                  disabled
                  className="w-full"
                  onClick={() => alert("Remind me clicked")}
                >
                  Coming soon <Lock className="h-3.5" />
                </Button>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => (
                    (document.body.style.overflow = ""),
                    this.setState({ isOpen: false })
                  )}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
}

export default Popup;
