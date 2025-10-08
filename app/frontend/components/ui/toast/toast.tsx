import { Root, Title, Description } from "@radix-ui/react-toast";
import "./styles.css";

interface Props {
  showToast: boolean;
  setShowToast: (showToast: boolean) => void;
  title: string;
  description: string;
}

export const Toast = ({
  showToast,
  setShowToast,
  title,
  description,
}: Props) => {
  return (
    <Root open={showToast} onOpenChange={setShowToast} className="ToastRoot">
      <div className="ToastContent">
        <Title>{title}</Title>
        <Description>{description}</Description>
      </div>
    </Root>
  );
};

