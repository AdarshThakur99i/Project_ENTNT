import { http, HttpResponse } from 'msw';

export const candidateHandlers = [
  http.get('/api/candidates', () => {
    console.log("MSW: Intercepted GET /api/candidates");
    return HttpResponse.json([{ id: 1, name: 'Alice' }]);
  }),
];
