import Image from "next/image";

export function BenefitCard({
  title,
  description,
  icon,
  tooltip,
}: {
  title: string;
  description: string;
  icon: string | JSX.Element;
  tooltip?: JSX.Element;
}) {
  return (
    <div className="border-white-10 flex min-h-[218px] flex-col justify-start rounded-md border p-6 text-center">
      <div className="mb-4">
        {typeof icon === "string" ? (
          <Image src={icon} width={20} height={20} alt="icon" />
        ) : (
          icon
        )}
      </div>
      <div className="text-left">
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="font-light text-[#929292]">{description}</p>
        {tooltip ? (
          <div className="mt-2 flex items-center gap-1">{tooltip}</div>
        ) : null}
      </div>
    </div>
  );
}
