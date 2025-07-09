import { Icon, IconProps } from '@chakra-ui/react';

export const FormErrorIcon: React.FC<IconProps> = props => (
  <Icon
    width="4"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_578_15641)">
      <path
        d="M9.5 16.875C14.0909 16.875 17.8125 13.3492 17.8125 9C17.8125 4.65076 14.0909 1.125 9.5 1.125C4.90913 1.125 1.1875 4.65076 1.1875 9C1.1875 13.3492 4.90913 16.875 9.5 16.875Z"
        stroke="#DC3434"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <path
        d="M8.82005 13V11.8H10.18V13H8.82005ZM8.82005 11.2V5.8H10.18V11.2H8.82005Z"
        fill="#DC3434"
      />
    </g>
    <defs>
      <clipPath id="clip0_578_15641">
        <rect width="19" height="18" fill="white" />
      </clipPath>
    </defs>
  </Icon>
);

export default FormErrorIcon;
