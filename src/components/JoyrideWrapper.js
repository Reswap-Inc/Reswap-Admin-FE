import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Joyride from 'react-joyride';
import { Button } from '@mui/material';

// Custom tooltip component for Joyride
const CustomTooltip = ({ step, backProps, closeProps, primaryProps, tooltipProps, index, size, skipStep }) => (
  <div {...tooltipProps} style={{ padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', maxWidth: 400 }}>
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <button {...closeProps} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>×</button>
    </div>
    <div style={{ marginBottom: 16 }}>{step.content}</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
      {index > 0 && (
        <Button {...backProps} variant="outlined" size="small">Back</Button>
      )}
      <Button onClick={skipStep} variant="outlined" size="small">Skip Step</Button>
      <Button {...primaryProps} variant="contained" size="small">
        {index === size - 1 ? 'Finish' : 'Next'}
      </Button>
    </div>
    <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>Step {index + 1} of {size}</div>
  </div>
);

const JoyrideWrapper = ({ steps: propSteps = [], forceStart = false, onTourEnd }) => {
  const [runTour, setRunTour] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const defaultSteps = [
    { target: '.navbar-tour', content: 'This is the navigation bar.', path: '/web/admin/home', disableBeacon: true },
    { target: '.listing-tour', content: 'This shows all property listings.', path: '/web/admin/home', disableBeacon: true },
    { target: '.add-button-tour', content: 'Click here to add a new listing.', path: '/web/admin/home', disableBeacon: true },
    { target: '.add-listing-tour', content: 'Click here to create a new listing.', path: '/web/admin/home/add-listing', disableBeacon: true },
    { target: '.chat-tour', content: 'Access the admin chat here.', path: '/web/admin/admin-chat', disableBeacon: true },
  ];

  const steps = propSteps.length ? propSteps : defaultSteps;
  const intervalRef = useRef(null);
  const isNavigatingRef = useRef(false);
  const [tourKey, setTourKey] = useState(0); // Add key to force re-render

  // Initialize tour
  useEffect(() => {
    // Only start tour if forceStart is explicitly true
    // Remove automatic start based on localStorage
    if (forceStart) {
      initializeTour();
    }
  }, [forceStart, tourKey]);

  const initializeTour = () => {
    const currentStep = steps[0]; // Always start from first step
    setStepIndex(0);
    setRunTour(true); // Start the tour immediately
    // Navigate to first step if needed
    if (currentStep && location.pathname !== currentStep.path) {
      navigate(currentStep.path);
    }
    // Remove interval logic for waiting for the target
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const navigateToStep = async (targetStepIndex) => {
    const targetStep = steps[targetStepIndex];
    
    if (!targetStep) return;

    console.log('Navigating to step:', targetStepIndex, 'Path:', targetStep.path);
    
    // If we need to navigate to a different path
    if (targetStep.path !== location.pathname) {
      isNavigatingRef.current = true;
      setRunTour(false); // Pause tour
      navigate(targetStep.path);

      // Wait for the target element to appear
      const waitForElement = (selector, timeout = 5000) =>
        new Promise((resolve, reject) => {
          let elapsed = 0;
          const interval = 100;
          const check = () => {
            if (document.querySelector(selector)) {
              resolve(true);
            } else {
              elapsed += interval;
              if (elapsed >= timeout) reject();
              else setTimeout(check, interval);
            }
          };
          check();
        });

      try {
        await waitForElement(targetStep.target);
        setStepIndex(targetStepIndex);
        setRunTour(true);
        isNavigatingRef.current = false;
      } catch {
        console.warn('Target element not found:', targetStep.target);
        setStepIndex(targetStepIndex);
        setRunTour(true);
        isNavigatingRef.current = false;
      }
    } else {
      // Same path, just update step index
      setStepIndex(targetStepIndex);
    }
  };

  const handleJoyrideCallback = async (data) => {
    console.log('Joyride callback:', data); // Debug log
    const { status, type, action } = data;
    if (status === 'finished' || status === 'skipped' || action === 'close') {
      setRunTour(false);
      if (onTourEnd) {
        onTourEnd();
      }
      return;
    }

    // Prevent handling during navigation
    if (isNavigatingRef.current) {
      console.log('Navigation in progress, ignoring callback');
      return;
    }

    if (type === 'step:after') {
      let targetStepIndex;
      
      if (action === 'next') {
        targetStepIndex = stepIndex + 1;
      } else if (action === 'prev') {
        targetStepIndex = stepIndex - 1;
      } else {
        return; // Unknown action
      }

      console.log('Action:', action, 'Current step:', stepIndex, 'Target step:', targetStepIndex);

      // Check bounds
      if (targetStepIndex < 0 || targetStepIndex >= steps.length) {
        console.log('Target step out of bounds');
        if (targetStepIndex >= steps.length) {
          setRunTour(false);
          if (onTourEnd) {
            onTourEnd();
          }
        }
        return;
      }

      await navigateToStep(targetStepIndex);
    }
  };

  // Handler to skip the current step (advance to next step)
  const skipStep = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setRunTour(false);
      if (onTourEnd) onTourEnd();
    }
  };

  // Method to restart tour
  const restartTour = () => {
    setRunTour(false);
    setStepIndex(0);
    setTourKey(prev => prev + 1);
  };

  // Expose restart method via ref (optional)
  React.useImperativeHandle(forceStart ? null : undefined, () => ({
    restartTour
  }));

  return (
    <Joyride
      key={tourKey} // Force re-render when key changes
      steps={steps}
      run={runTour}
      stepIndex={stepIndex}
      continuous={true}
      scrollToFirstStep={true}
      showProgress={true}
      showSkipButton={false} // Hide default skip button
      showCloseButton={true} // Keep close (X) icon
      disableOverlayClose={true}
      showBeacon={false}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Step',
      }}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 9999,
          primaryColor: '#1A91FF',
          textColor: '#333',
          backgroundColor: '#fff',
        },
      }}
      tooltipComponent={(props) => (
        <CustomTooltip {...props} skipStep={skipStep} />
      )}
    />
  );
};

export default JoyrideWrapper;