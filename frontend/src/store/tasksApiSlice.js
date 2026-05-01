import { apiSlice } from './apiSlice';
const TASKS_URL = '/api/tasks';

export const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasksByProject: builder.query({
      query: (projectId) => ({
        url: `${TASKS_URL}/project/${projectId}`,
      }),
      providesTags: ['Task'],
    }),
    createTask: builder.mutation({
      query: (data) => ({
        url: TASKS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation({
      query: (taskId) => ({
        url: `${TASKS_URL}/${taskId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
    getDashboardStats: builder.query({
      query: () => ({
        url: `${TASKS_URL}/stats`,
      }),
      providesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTasksByProjectQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetDashboardStatsQuery,
} = tasksApiSlice;
