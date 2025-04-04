const BANDWIDTH_COST_PER_GB = 0.1;

const PricingData = {
  plans: [
    {
      name: "On-demand",
      base_price: 0,
      base_MAU_limit: 1000,
      freeGB: 100,
      MAU_pricing: [
        { range: [1, 199000], price_per_MAU: 0.005 },
        { range: [199001, 499000], price_per_MAU: 0.00375 },
        { range: [499001, 999000], price_per_MAU: 0.0034 },
        { range: [1000000, 1999999], price_per_MAU: 0.003 },
        { range: [2000000, 2999999], price_per_MAU: 0.0024 },
        { range: [3000000, 5999999], price_per_MAU: 0.0022 },
        { range: [6000000, 9999999], price_per_MAU: 0.0016 },
        { range: [10000000, 19999999], price_per_MAU: 0.0014 },
        { range: [20000000, 34999999], price_per_MAU: 0.00115 },
        { range: [25000000, 59999999], price_per_MAU: 0.001 },
        { range: [40000000, 99999999], price_per_MAU: 0.0009 },
        { range: [100000000, null], price_per_MAU: 0.00085 },
      ],
    },
    {
      name: "Production",
      base_price: 99,
      base_MAU_limit: 50000,
      freeGB: 1024,
      MAU_pricing: [
        { range: [1, 150000], price_per_MAU: 0.005 },
        { range: [150001, 449999], price_per_MAU: 0.00375 },
        { range: [450000, 999999], price_per_MAU: 0.0034 },
        { range: [1000000, 1999999], price_per_MAU: 0.003 },
        { range: [2000000, 2999999], price_per_MAU: 0.0024 },
        { range: [3000000, 5999999], price_per_MAU: 0.0022 },
        { range: [6000000, 9999999], price_per_MAU: 0.0016 },
        { range: [10000000, 19999999], price_per_MAU: 0.0014 },
        { range: [20000000, 34999999], price_per_MAU: 0.00115 },
        { range: [35000000, 59999999], price_per_MAU: 0.001 },
        { range: [60000000, 99999999], price_per_MAU: 0.0009 },
        { range: [100000000, null], price_per_MAU: 0.00085 },
      ],
    },
    {
      name: "Enterprise",
      base_price: 999,
      base_MAU_limit: 1000000,
      freeGB: 10000,
      MAU_pricing: [
        { range: [1, 999999], price_per_MAU: 0.003 },
        { range: [1000000, 1999999], price_per_MAU: 0.0024 },
        { range: [2000000, 4999999], price_per_MAU: 0.0022 },
        { range: [5000000, 8999999], price_per_MAU: 0.0016 },
        { range: [9000000, 18999999], price_per_MAU: 0.0014 },
        { range: [19000000, 33999999], price_per_MAU: 0.00115 },
        { range: [34000000, 59999999], price_per_MAU: 0.001 },
        { range: [60000000, 99999999], price_per_MAU: 0.0009 },
        { range: [100000000, null], price_per_MAU: 0.00085 },
      ],
    },
  ],
} as const;

function calculatePrices(numberOfUsers: number, gbUsage: number) {
  return PricingData.plans.reduce(
    (acc, plan) => {
      let cost = plan.base_price;
      let extraMAUs = Math.max(0, numberOfUsers - plan.base_MAU_limit);

      for (const tier of plan.MAU_pricing) {
        const [start, end] = tier.range;
        const tierMAUs = Math.min(
          extraMAUs,
          (end || Infinity) - Math.max(start, plan.base_MAU_limit),
        );
        if (tierMAUs > 0) {
          cost += tierMAUs * tier.price_per_MAU;
          extraMAUs -= tierMAUs;
        }
        if (extraMAUs <= 0) break;
      }

      const bandwidthCost =
        Math.max(0, gbUsage - (numberOfUsers * 40) / 1000 - plan.freeGB) *
        BANDWIDTH_COST_PER_GB;

      cost += bandwidthCost > 0 ? bandwidthCost : 0;

      acc[plan.name] = Math.round(cost * 100) / 100;
      return acc;
    },
    {} as Record<string, number>,
  );
}

function findBestPlan({
  numberOfUsers,
  gbUsage,
}: {
  numberOfUsers: number;
  gbUsage: number;
}) {
  const prices = calculatePrices(numberOfUsers, gbUsage);
  const [planName, totalCost] = Object.entries(prices).reduce((a, b) =>
    a[1] < b[1] ? a : b,
  );
  const plan = PricingData.plans.find((p) => p.name === planName);

  if (!plan) return 0;

  return totalCost;
}

export { calculatePrices, findBestPlan };
