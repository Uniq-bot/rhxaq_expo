// Task state machine configuration
export const taskStates = {
  PENDING: {
    allowedNext: ['IN_PROGRESS', 'CANCELLED']
  },
  IN_PROGRESS: {
    allowedNext: ['COMPLETED', 'CANCELLED']
  },
  COMPLETED: {
    allowedNext: []
  },
  CANCELLED: {
    allowedNext: []
  }
};

// Get current state with allowed next states
export const getTaskState = (currentStatus) => {
  const status = currentStatus?.toUpperCase();
  
  if (!taskStates[status]) {
    throw new Error(`Invalid task status: ${currentStatus}`);
  }

  return {
    status,
    allowedNext: [...taskStates[status].allowedNext]
  };
};

// Validate if a state transition is allowed
export const isValidTransition = (currentStatus, nextStatus) => {
  const state = getTaskState(currentStatus);
  return state.allowedNext.includes(nextStatus);
};
