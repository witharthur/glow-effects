import axolotl from "@/assets/axolotl.png";

export const EmptyState = ({
  message,
  cta,
  onCta,
}: {
  message: string;
  cta: string;
  onCta: () => void;
}) => (
  <div className="flex flex-col items-center justify-center px-6 py-20 text-center animate-fade-in">
    <img
      src={axolotl}
      alt=""
      width={112}
      height={112}
      className="h-112 w-112 object-contain mb-6"
    />
    <p
      className="mb-6"
      style={{
        width: '361px',
        height: '26px',
        fontFamily: '"Manrope", sans-serif',
        fontWeight: 700,
        fontSize: '18px',
        lineHeight: '26px',
        letterSpacing: '0px',
        textAlign: 'center',
        verticalAlign: 'middle',
        color: 'rgba(17, 20, 22, 1)',
      }}
    >
      {message}
    </p>
    <button
      onClick={onCta}
      className="w-[361px] h-[42px] px-8 py-4 rounded-[14px] bg-[#6115cd] shadow-button hover:opacity-95 transition-opacity flex items-center justify-center"
      style={{
        fontFamily: '"Manrope", sans-serif',
        fontWeight: 600,
        fontSize: '15px',
        lineHeight: '20px',
        letterSpacing: '0px',
        color: 'rgba(255, 255, 255, 1)',
      }}
    >
      {cta}
    </button>
  </div>
);
