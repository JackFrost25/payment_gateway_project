'use client';

export default function PaymentFlowDiagram({ steps, activeStep }) {
  return (
    <div className="flow-diagram">
      {steps.map((step, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
          <div
            className={`flow-step ${
              idx < activeStep ? 'complete' : idx === activeStep ? 'active' : ''
            }`}
          >
            <div className="flow-step-circle">{step.icon}</div>
            <div className="flow-step-label">{step.label}</div>
            <div className="flow-step-desc">{step.desc}</div>
          </div>
          {idx < steps.length - 1 && (
            <div
              className={`flow-arrow ${idx < activeStep ? 'active' : ''}`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}
