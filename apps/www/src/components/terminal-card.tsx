"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import ShineBorder from "./ui/shine-border";

// Constants
const TYPING_SPEED = 100;
const STEP_DELAY = 1500;
const SPINNER_SPEED = 80;
const UPDATE_NAME = "v1.0.3-hotfix";
const SPIN_CHARS = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const INITIAL_COMMAND = "npm install -g ethern-cli";

const STEPS = [
  {
    loading: "Exporting and bundling the app...",
    complete: "App export and bundle complete",
  },
  {
    loading: "Establishing server connection...",
    complete: "Server handshake successful",
  },
  {
    loading: "Preparing assets...",
    complete: "Assets prepared",
  },
  {
    loading: UPDATE_NAME,
    complete: `Enter a name for the update ... ${UPDATE_NAME}`,
    isInput: true,
  },
  {
    loading: "Creating update...",
    complete: "Update created and deployed!",
    extraInfo: "expo-updates manifest generated",
  },
];

// Types
type Command = {
  command: string;
  output: string[];
  completed: boolean;
};

const StepOutput = ({
  step,
  currentStep,
  spinChar,
  index,
}: {
  step: (typeof STEPS)[number];
  currentStep: number;
  spinChar: string;
  index: number;
}) => {
  const isLoading = currentStep === index;

  return (
    <div className="pl-4">
      {isLoading ? (
        <p className="text-gray-300">
          {!step.isInput && <span className="text-yellow-500">{spinChar}</span>}{" "}
          {step.isInput ? (
            <>
              <span className="text-blue-400">?</span> Enter a name for the
              update › {step.loading}
              <span className="animate-pulse">█</span>
            </>
          ) : (
            <>
              {step.loading}
              {step.extraInfo && (
                <span className="text-gray-400 ml-2">{step.extraInfo}</span>
              )}
            </>
          )}
        </p>
      ) : (
        <p className="text-emerald-500">✔ {step.complete}</p>
      )}
    </div>
  );
};

const CommandPrompt = ({
  text,
  isTyping,
}: {
  text: string;
  isTyping: boolean;
}) => (
  <div className="flex items-center gap-2 font-mono text-gray-300">
    <span className="text-emerald-500">~</span>
    <span className="text-blue-400">$</span>
    <span>
      {text}
      {isTyping && <span className="animate-pulse">█</span>}
    </span>
  </div>
);

export function TerminalCard() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentTyping, setCurrentTyping] = useState("");
  const [spinIndex, setSpinIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const isTypingRef = useRef(false);

  // Spinner animation
  useEffect(() => {
    const timer = setInterval(() => {
      setSpinIndex((prev) => (prev + 1) % SPIN_CHARS.length);
    }, SPINNER_SPEED);
    return () => clearInterval(timer);
  }, []);

  // Type out a command character by character
  const typeCommand = useCallback((command: string, callback: () => void) => {
    if (isTypingRef.current) return;
    isTypingRef.current = true;

    let index = 0;
    const typeTimer = setInterval(() => {
      if (index < command.length) {
        setCurrentTyping(command.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeTimer);
        setCurrentTyping("");
        isTypingRef.current = false;
        callback();
      }
    }, TYPING_SPEED);
    return () => {
      clearInterval(typeTimer);
      isTypingRef.current = false;
    };
  }, []);

  // Initial command sequence
  useEffect(() => {
    if (commands.length === 0) {
      typeCommand(INITIAL_COMMAND, () => {
        setCommands([
          { command: INITIAL_COMMAND, output: [], completed: false },
        ]);

        const timer1 = setTimeout(() => {
          setCommands((prev) => [
            {
              ...prev[0],
              output: ["added 127 packages in 2.3s", "+ ethern-cli@1.2.0"],
              completed: true,
            },
          ]);

          const timer2 = setTimeout(() => {
            typeCommand("ethern", () => {
              setCommands((prev) => [
                ...prev,
                { command: "ethern", output: [], completed: false },
              ]);
              setCurrentStep(1);
            });
          }, 1000);

          return () => clearTimeout(timer2);
        }, 2000);

        return () => clearTimeout(timer1);
      });
    }
  }, [commands.length, typeCommand]);

  // Progress through ethern command steps
  useEffect(() => {
    if (
      commands.length === 2 &&
      currentStep > 0 &&
      currentStep <= STEPS.length
    ) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, STEP_DELAY);
      return () => clearTimeout(timer);
    }
  }, [currentStep, commands.length]);

  return (
    <ShineBorder
      className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
      color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
    >
      <div className="group relative w-full h-full transition-all">
        <div className="relative w-full max-w-full overflow-hidden rounded-lg bg-black shadow-2xl">
          <div className="bg-black p-4 flex items-center">
            <div className="flex items-center gap-1.5">
              <button className="h-2.5 w-2.5 rounded-full bg-[#ff5f56] opacity-75 transition-opacity hover:opacity-100" />
              <button className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e] opacity-75 transition-opacity hover:opacity-100" />
              <button className="h-2.5 w-2.5 rounded-full bg-[#27c93f] opacity-75 transition-opacity hover:opacity-100" />
            </div>
          </div>
          <div className="h-[300px] sm:h-[320px] md:h-[350px] bg-black p-3 sm:p-4 md:p-6 font-mono text-white text-xs sm:text-sm md:text-base">
            <div className="space-y-2 sm:space-y-3 md:space-y-4">
              {commands.map((cmd, index) => (
                <div key={`cmd-${cmd.command}-${index}`} className="space-y-2">
                  <CommandPrompt text={cmd.command} isTyping={false} />
                  {cmd.output.map((line) => (
                    <div key={line} className="pl-4">
                      <p
                        className={
                          line.startsWith("+")
                            ? "text-emerald-500"
                            : "text-gray-400"
                        }
                      >
                        {line}
                      </p>
                    </div>
                  ))}
                  {index === commands.length - 1 &&
                    cmd.command === "ethern" && (
                      <div className="font-mono space-y-2 text-sm leading-6">
                        {STEPS.map(
                          (step, i) =>
                            currentStep >= i && (
                              <StepOutput
                                key={`${step.loading}-${i}`}
                                step={step}
                                currentStep={currentStep}
                                spinChar={SPIN_CHARS[spinIndex]}
                                index={i}
                              />
                            ),
                        )}
                      </div>
                    )}
                </div>
              ))}
              {currentTyping && (
                <CommandPrompt text={currentTyping} isTyping={true} />
              )}
            </div>
          </div>
        </div>
      </div>
    </ShineBorder>
  );
}
