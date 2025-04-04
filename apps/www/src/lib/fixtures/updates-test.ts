import type { Project, Update } from "@ethern/db";

export const updatesTest = [
  {
    id: "1",
    name: "Update 1",
    deletedAt: null,
    createdAt: new Date(),
    platform: "all",
    projectId: 5,
    runtimeVersion: "1.0.0",
  },
  {
    id: "2",
    name: "Update 2",
    deletedAt: null,
    createdAt: new Date(),
    platform: "all",
    projectId: 5,
    runtimeVersion: "1.0.0",
  },
  {
    id: "3",
    name: "Update 3",
    deletedAt: null,
    createdAt: new Date(),
    platform: "all",
    projectId: 5,
    runtimeVersion: "1.0.0",
  },
  {
    id: "4",
    name: "Update 4",
    deletedAt: null,
    createdAt: new Date(),
    platform: "all",
    projectId: 5,
    runtimeVersion: "1.0.0",
  },
] as Update[];

export const projectesTest = [
  {
    id: 1,
    name: "Project 1",
    createdAt: new Date(),
    size: 1024,
    uid: "@ethern",
  },
  {
    id: 1,
    name: "Project 1",
    createdAt: new Date(),
    size: 1024,
    uid: "@ethern",
  },
  {
    id: 1,
    name: "Project 1",
    createdAt: new Date(),
    size: 1024,
    uid: "@ethern",
  },
  {
    id: 1,
    name: "Project 1",
    createdAt: new Date(),
    size: 1024,
    uid: "@ethern",
  },
  {
    id: 1,
    name: "Project 1",
    createdAt: new Date(),
    size: 1024,
    uid: "@ethern",
  },
  {
    id: 1,
    name: "Project 1",
    createdAt: new Date(),
    size: 1024,
    uid: "@ethern",
  },
] as Project[];
