import { apiSlice } from './apiSlice';
const PROJECTS_URL = '/api/projects';

export const projectsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({
        url: PROJECTS_URL,
      }),
      providesTags: ['Project'],
    }),
    getProjectDetails: builder.query({
      query: (projectId) => ({
        url: `${PROJECTS_URL}/${projectId}`,
      }),
      providesTags: ['Project'],
    }),
    createProject: builder.mutation({
      query: (data) => ({
        url: PROJECTS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation({
      query: (data) => ({
        url: `${PROJECTS_URL}/${data.id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `${PROJECTS_URL}/${projectId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Project'],
    }),
    removeMember: builder.mutation({
      query: ({ projectId, userId }) => ({
        url: `${PROJECTS_URL}/${projectId}/members/${userId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectDetailsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useRemoveMemberMutation,
} = projectsApiSlice;
