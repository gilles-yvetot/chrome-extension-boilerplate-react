import React, { ReactNode } from 'react';

export function MoreInfo() {
  return (
    <>
      <MoreInfoTemplateAndDocs />
    </>
  );
}

function MoreInfoItem({ children }: { children: ReactNode }) {
  return (
    <div style={{ textAlign: 'center', padding: '14px 0', marginTop: 'auto' }}>
      {children}
    </div>
  );
}

export function MoreInfoTemplateAndDocs() {
  return (
    <MoreInfoItem>
      <span>Built with the Atlas App Services Template</span> |{' '}
      <a target="_blank" href="https://docs.mongodb.com/realm" rel="noreferrer">
        Docs
      </a>
    </MoreInfoItem>
  );
}
