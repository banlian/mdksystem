import className from 'classnames';

type IButtonProps = {
  xl?: boolean;
  children: React.ReactNode;
  className?: string;
};

const Button = (props: IButtonProps) => {
  const btnClass = className(
    'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200',
    {
      'text-lg py-3 px-6': !props.xl,
      'text-xl py-4 px-8': props.xl,
    },
    props.className || 'btn-primary',
  );

  return <button className={btnClass}>{props.children}</button>;
};

export { Button };
