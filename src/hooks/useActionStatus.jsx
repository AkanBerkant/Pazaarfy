import React from 'react';

export const useActionStatus = ({ initialCount, initialStatus }) => {
  const [currentCount, setCurrentCount] = React.useState(initialCount);

  const actionStatus = React.useMemo(() => {
    const previouslyStatus = initialCount === currentCount && initialStatus;
    const recentlyStatus = initialCount + 1 === currentCount && !initialStatus;

    return previouslyStatus || recentlyStatus;
  }, [currentCount, initialCount, initialStatus]);

  const onPositiveAction = () => {
    setCurrentCount(initialStatus ? initialCount : initialCount + 1);
  };

  const onNegativeAction = () => {
    setCurrentCount(initialStatus ? initialCount - 1 : initialCount);
  };

  return {
    actionStatus,
    currentCount,
    setCurrentCount,
    onPositiveAction,
    onNegativeAction,
  };
};
