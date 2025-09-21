
Directory Structure :
<pre>
.
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public
│   ├── mockServiceWorker.js
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── Assessments
│   │   └── AssessmentBuilder.tsx
│   ├── Candidates
│   │   ├── CandidateProfile.tsx
│   │   ├── CandidatesList.tsx
│   │   └── KanbanBoard.tsx
│   ├── HomePages
│   │   ├── AssessmentPage.tsx
│   │   └── HomePage.tsx
│   ├── Jobs
│   │   ├── JobDetail.tsx
│   │   ├── JobFilters.tsx
│   │   └── JobsList.tsx
│   ├── Layout.tsx
│   ├── api
│   │   ├── JobsApi
│   │   │   ├── AssessmentApi.ts
│   │   │   └── JobsApi.ts
│   │   └── candidatesApi
│   │       └── candidateApi.ts
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── AssessmentComponents
│   │   │   ├── AssessmentPreview.tsx
│   │   │   ├── AssessmentRuntime.tsx
│   │   │   ├── QuestionEditor.tsx
│   │   │   └── SectionEditor.tsx
│   │   ├── CandidateComponents
│   │   │   ├── CandidateCard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── Note.tsx
│   │   │   ├── NoteInput.tsx
│   │   │   └── mentionStyles.css
│   │   ├── JobComponents
│   │   │   ├── JobForm.tsx
│   │   │   └── JobItem.tsx
│   │   ├── NotFoundPage.tsx
│   │   └── pagination.tsx
│   ├── data
│   │   ├── AssessmentFunctions
│   │   │   └── assessment.ts
│   │   ├── CandidatesFunctions
│   │   │   ├── mockCandidates.ts
│   │   │   └── mockUsers.ts
│   │   ├── JobsData
│   │   │   └── Jobs.types.ts
│   │   └── database
│   │       ├── browser.ts
│   │       ├── db.ts
│   │       ├── handlers
│   │       │   ├── AssessmentHandlers.ts
│   │       │   ├── CandidateHandlers.ts
│   │       │   ├── JobHandlers.ts
│   │       │   └── index.ts
│   │       └── seed.ts
│   ├── hooks
│   │   ├── AssessmentHooks
│   │   │   └── useAssessmentBuilder.ts
│   │   ├── CandidatesHook
│   │   │   └── useCandidates.ts
│   │   └── JobsHooks
│   │       ├── useDragAndDrop.ts
│   │       └── useJobs.ts
│   ├── index.css
│   ├── main.tsx
│   ├── routes
│   │   └── routes.tsx
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

</pre>
