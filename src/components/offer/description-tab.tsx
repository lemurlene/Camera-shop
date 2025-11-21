type DescriptionTabProps = {
  description: string;
  id: number;
  isActive: boolean;
};

export const DescriptionTab = ({
  description,
  id,
  isActive
}: DescriptionTabProps): JSX.Element => {
  const generateHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  };

  const sentences = description
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => sentence.trim() !== '');

  return (
    <div className={`tabs__element ${isActive ? 'is-active' : ''}`}>
      <div className="product__tabs-text">
        {sentences.map((sentence) => (
          <p key={`${id}-desc-${generateHash(sentence)}`}>
            {sentence}
          </p>
        ))}
      </div>
    </div>
  );
};
