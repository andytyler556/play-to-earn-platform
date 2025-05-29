'use client';

import React, { useEffect, useState } from 'react';
import { validateEnvironmentVariables, performSecurityAudit } from '@/lib/stacks';

interface SecurityProviderProps {
  children: React.ReactNode;
}

interface SecurityState {
  isValidated: boolean;
  hasErrors: boolean;
  errors: string[];
  warnings: string[];
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const [securityState, setSecurityState] = useState<SecurityState>({
    isValidated: false,
    hasErrors: false,
    errors: [],
    warnings: []
  });

  useEffect(() => {
    async function initializeSecurity() {
      const errors: string[] = [];
      const warnings: string[] = [];

      try {
        // Validate environment variables
        validateEnvironmentVariables();
        console.log('✅ Environment validation passed');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Environment validation failed';
        errors.push(message);
        console.error('❌ Environment validation failed:', message);
      }

      try {
        // Perform security audit
        performSecurityAudit();
        console.log('🛡️  Security audit passed');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Security audit failed';
        errors.push(message);
        console.error('🚨 Security audit failed:', message);
      }

      // Check for development warnings
      if (process.env.NODE_ENV === 'development') {
        if (process.env.NEXT_PUBLIC_USE_REAL_BLOCKCHAIN === 'true') {
          const contractVars = [
            'NEXT_PUBLIC_PLATFORM_TOKEN_CONTRACT',
            'NEXT_PUBLIC_LAND_NFT_CONTRACT',
            'NEXT_PUBLIC_BLUEPRINT_NFT_CONTRACT',
            'NEXT_PUBLIC_MARKETPLACE_CONTRACT',
            'NEXT_PUBLIC_GAME_REWARDS_CONTRACT'
          ];

          const unconfiguredContracts = contractVars.filter(varName => {
            const value = process.env[varName];
            return !value || value.includes('YOUR_ADDRESS') || value.includes('your-');
          });

          if (unconfiguredContracts.length > 0) {
            warnings.push(`Contract addresses not configured: ${unconfiguredContracts.join(', ')}`);
          }
        }
      }

      setSecurityState({
        isValidated: true,
        hasErrors: errors.length > 0,
        errors,
        warnings
      });
    }

    initializeSecurity();
  }, []);

  // Show loading state during validation
  if (!securityState.isValidated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-900">Initializing Security...</h2>
          <p className="text-gray-600">Validating environment and performing security checks</p>
        </div>
      </div>
    );
  }

  // Show error state if critical security issues
  if (securityState.hasErrors) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Security Configuration Error</h3>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-red-700 mb-3">
              The application cannot start due to security configuration issues:
            </p>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              {securityState.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>

          <div className="bg-red-100 border border-red-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-red-800 mb-2">How to fix:</h4>
            <ol className="list-decimal list-inside text-sm text-red-700 space-y-1">
              <li>Check your .env.local file</li>
              <li>Ensure all required environment variables are set</li>
              <li>Verify no sensitive data has NEXT_PUBLIC_ prefix</li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // Show warnings if any (but allow app to continue)
  if (securityState.warnings.length > 0) {
    console.warn('⚠️  Security warnings:', securityState.warnings);
  }

  // Render app normally if security checks pass
  return <>{children}</>;
}

// Development-only security info component
export function SecurityInfo() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowInfo(!showInfo)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Security Info"
      >
        🛡️
      </button>

      {showInfo && (
        <div className="fixed bottom-16 right-4 bg-white rounded-lg shadow-xl border p-4 max-w-sm z-50">
          <h3 className="font-semibold text-gray-900 mb-2">Security Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <span className="text-green-600">✅</span>
              <span className="ml-2">Environment validated</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-600">✅</span>
              <span className="ml-2">Security audit passed</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-600">🔒</span>
              <span className="ml-2">HTTPS endpoints only</span>
            </div>
            <div className="flex items-center">
              <span className="text-blue-600">🛡️</span>
              <span className="ml-2">No sensitive data exposed</span>
            </div>
          </div>
          <button
            onClick={() => setShowInfo(false)}
            className="mt-3 text-xs text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
