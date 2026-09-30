import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedServices: [],
  selectedBarber: null,
  selectedDate: '',
  selectedTimeSlot: '',
  validationState: { isCurrentStepValid: false },
  currentStep: 0,
};

const bookingSlice = createSlice({
  name: 'bookingWizard',
  initialState,
  reducers: {
    toggleService: (state, action) => {
      const exists = state.selectedServices.find(s => s.id === action.payload.id);
      if (exists) {
        state.selectedServices = state.selectedServices.filter(s => s.id !== action.payload.id);
      } else {
        state.selectedServices.push(action.payload);
      }
      state.validationState.isCurrentStepValid = state.selectedServices.length > 0;
    },
    setService: (state, action) => {
      // Keep for legacy/initial load if needed
      state.selectedServices = [action.payload];
      state.validationState.isCurrentStepValid = true;
    },
    setBarber: (state, action) => {
      state.selectedBarber = action.payload;
      state.selectedTimeSlot = '';
      state.validationState.isCurrentStepValid = !!action.payload;
    },
    setDate: (state, action) => {
      state.selectedDate = action.payload;
      state.selectedTimeSlot = '';
      state.validationState.isCurrentStepValid = !!action.payload;
    },
    setTimeSlot: (state, action) => {
      state.selectedTimeSlot = action.payload;
      state.validationState.isCurrentStepValid = !!action.payload;
    },
    setStep: (state, action) => {
      state.currentStep = action.payload;
      state.validationState.isCurrentStepValid = false;
    },
    resetBooking: () => initialState,
  },
});

export const { toggleService, setService, setBarber, setDate, setTimeSlot, setStep, resetBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
