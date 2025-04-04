"use client";

import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { EthernLogo } from "~/components/ethern-logo";
import { findBestPlan } from "~/lib/expo";
import { Slider } from "~/ui/slider";

const MIN_VALUE = 1000;
const MAX_VALUE = 1000000;

const logMin = Math.log(MIN_VALUE);
const logMax = Math.log(MAX_VALUE);

function valueToLog(value: number): number {
  return Math.exp(logMin + (value / 100) * (logMax - logMin));
}

function logToValue(logValue: number): number {
  return ((Math.log(logValue) - logMin) / (logMax - logMin)) * 100;
}

export function PricingCalculator() {
  const [count, setCount] = useState(10000);
  const [costs, setCosts] = useState({
    expo: 0,
    ethern: 0,
  });
  const [updatePerUser, setUpdatePerUser] = useState(5);
  const [averageUpdateSize, setAverageUpdateSize] = useState(2); // 2 * 5 = 10MB

  useEffect(() => {
    let ethern: number;

    if (count <= 1000) {
      ethern = 0;
    } else if (count <= 50_000) {
      ethern = (count - 1000) * 0.0005;
    } else if (count >= 50_000 && count <= 250_000) {
      ethern = (count - 50_000) * 0.0005 + 19;

      if (ethern >= 79) {
        ethern = 79;
      }
    } else if (count <= 250_000) {
      ethern = (count - 50_000) * 0.0005 + 19;

      if (ethern >= 79) {
        ethern = 79;
      }
    } else if (count >= 999_999) {
      ethern = 499;
    } else {
      ethern = (count - 250_000) * 0.0005 + 79;
    }

    if (ethern > 299) {
      ethern = 299;
    }

    const gbUsage = count * ((averageUpdateSize * 5) / 1000) * updatePerUser;

    const expo = findBestPlan({ numberOfUsers: count, gbUsage });

    setCosts({ expo, ethern });
  }, [count, updatePerUser, averageUpdateSize]);

  const handleIncreaseSize = () => {
    setAverageUpdateSize((prevSize) => prevSize + 1);
  };

  const handleDecreaseSize = () => {
    setAverageUpdateSize((prevSize) =>
      prevSize > 2 ? prevSize - 1 : prevSize,
    );
  };

  const getExpoColor = (price: number) => {
    // Normalize the price to a value between 0 and 1
    // Assuming max price is 1000 for this example, adjust as needed
    const normalizedPrice = Math.min(price / 1000, 1);

    // Calculate hue: 60 (yellow) to 0 (red)
    const hue = 60 - normalizedPrice * 60;

    // Start with very low saturation and high lightness, increase saturation and decrease lightness as price increases
    const saturation = normalizedPrice * 100; // 0% to 100%
    const lightness = 95 - normalizedPrice * 45; // 95% to 50%

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div className="flex w-full max-w-4xl flex-col-reverse items-center justify-center gap-8 sm:flex-row sm:items-stretch">
      <div className="border-white-10 mt-20 flex flex-col items-center justify-center gap-3 rounded-md border p-6 pb-10 shadow-md sm:mt-0 sm:min-w-[370px]">
        <div className="relative">
          <h1 className="text-xl font-semibold">Estimated Usage</h1>
        </div>
        <div className="flex w-full gap-4 text-sm h-full">
          <div className="w-full flex flex-col justify-between">
            <div className="mb-1 font-medium">Update Size in MB</div>
            <div className="border-input placeholder:text-muted-foreground flex h-9 w-full flex-row items-center justify-between rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm">
              <MinusIcon
                className="cursor-pointer"
                onClick={handleDecreaseSize}
              />
              <span className="select-none">{averageUpdateSize * 5}</span>
              <PlusIcon
                className="cursor-pointer"
                onClick={handleIncreaseSize}
              />
            </div>
          </div>
          <div className="w-full flex flex-col justify-between">
            <div className="mb-1 font-medium">Updates Per User</div>
            <div className="border-input placeholder:text-muted-foreground flex h-9 w-full flex-row items-center justify-between rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm">
              <MinusIcon
                className="cursor-pointer"
                onClick={() =>
                  updatePerUser !== 1
                    ? setUpdatePerUser(updatePerUser - 1)
                    : null
                }
              />
              <span className="select-none">{updatePerUser}</span>
              <PlusIcon
                className="cursor-pointer"
                onClick={() => setUpdatePerUser(updatePerUser + 1)}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
          <div className="select-none text-start text-sm font-medium">
            Monthly Updated Users
          </div>
          <Slider
            name="monthly-updates"
            className="mb-4"
            max={100}
            min={0}
            value={[logToValue(count)]}
            onValueChange={(value) => setCount(valueToLog(value[0]))}
          >
            <div className="rounded-full pt-14 text-center shadow">
              {Intl.NumberFormat("en-US", {
                maximumFractionDigits: 0,
              }).format(count)}
            </div>
          </Slider>
        </div>
      </div>

      <div className="border-white-10 relative flex min-h-96 w-full flex-row items-end gap-6 rounded-lg border px-4 pt-6 shadow-md sm:min-h-fit">
        <div className="absolute top-4">
          <YouWillSave />
        </div>
        <div className="relative flex h-auto w-1/2 justify-center">
          <div
            style={{ height: `${costs.ethern / 7}px` }}
            className="absolute bottom-0 w-20 rounded-t-sm bg-white"
          />
          <div className="absolute bottom-28 z-50 translate-y-16 text-base font-semibold text-white mix-blend-difference">
            {Math.round(costs.ethern)}$
          </div>
          <div className="absolute bottom-4 z-50 translate-y-16 text-base font-semibold text-white">
            <EthernLogo />
          </div>
        </div>
        <div className="relative flex h-auto w-1/2 justify-center">
          <div
            style={{
              height: `${costs.expo / 7}px`,
              backgroundColor: getExpoColor(costs.expo),
            }}
            className="absolute bottom-0 w-20 rounded-t-sm"
          />
          <div className="absolute bottom-28 translate-y-16 text-base font-semibold text-white mix-blend-screen">
            {Math.round(costs.expo)}$
          </div>
          <div className="absolute bottom-5 translate-y-16 text-base font-semibold text-white">
            <svg
              fill="white"
              height="26"
              viewBox="0 0 114 32"
              width="114"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="#fff">
                <path d="m14.8051 10.3339c.2555-.37661.5352-.4245.7621-.4245s.6049.04789.8605.4245c2.014 2.7663 5.3384 8.2769 7.7907 12.3418 1.5992 2.6509 2.8275 4.6869 3.0795 4.946.946.9727 2.2434.3665 2.9973-.7368.7422-1.0862.9482-1.8489.9482-2.6626 0-.5542-10.7527-20.55225-11.8356-22.21684-1.0414-1.601054-1.3806-2.00546-3.163-2.00546h-1.3338c-1.7771 0-2.0339.404406-3.0754 2.00546-1.0828 1.66459-11.83557539 21.66264-11.83557539 22.21684 0 .8137.20604539 1.5764.94826139 2.6626.753894 1.1033 2.051284 1.7095 2.997254.7368.25203-.2591 1.48033-2.2951 3.07955-4.946 2.45226-4.0649 5.76601-9.5755 7.78001-12.3418z" />
                <path d="m38.7183 1.7677v24.5506h14.9597v-4.9803h-9.7988v-5.1907h8.7178v-4.9802h-8.7178v-4.41914h9.7988v-4.98026z" />
                <path d="m73.6393 26.3183-6.207-8.9084 5.7886-8.31209h-5.8584l-2.8594 4.06839-2.8246-4.06839h-5.9281l5.7886 8.34719-6.1721 8.8733h5.8583l3.243-4.6646 3.243 4.6646z" />
                <path d="m86.1153 8.74708c-2.3712 0-4.2194.98203-5.405 2.77072v-2.41999h-4.9168v22.90219h4.9168v-8.1017c1.1856 1.7887 3.0338 2.7707 5.405 2.7707 4.4287 0 7.9506-4.0333 7.9506-8.9785s-3.5219-8.94342-7.9506-8.94342zm-1.1158 13.18722c-2.4062 0-4.2892-1.8238-4.2892-4.2438 0-2.3849 1.883-4.2437 4.2892-4.2437 2.3712 0 4.2891 1.8939 4.2891 4.2437 0 2.3849-1.9179 4.2438-4.2891 4.2438z" />
                <path d="m104.791 8.74708c-5.0565 0-8.8924 3.85792-8.8924 8.97852 0 5.1205 3.8359 8.9434 8.8924 8.9434 5.021 0 8.892-3.8229 8.892-8.9434 0-5.1206-3.871-8.97852-8.892-8.97852zm0 4.73472c2.301 0 4.08 1.7887 4.08 4.2438 0 2.3849-1.779 4.2087-4.08 4.2087-2.337 0-4.08-1.8238-4.08-4.2087 0-2.4551 1.743-4.2438 4.08-4.2438z" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  function YouWillSave() {
    return (
      <p>
        You&apos;ll save{" "}
        <span className="text-center font-semibold text-green-500">
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(costs.expo - costs.ethern)}
          <br className="block sm:hidden" />
        </span>{" "}
        with Ethern.
      </p>
    );
  }
}
