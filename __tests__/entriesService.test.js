import { jest } from "@jest/globals";

jest.unstable_mockModule("../repositories/entriesRepository.js", () => ({
  isValidId: jest.fn(() => true),
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "fake-id", ...data })),
  updateById: jest.fn(),
  removeById: jest.fn(),
  listEntries: jest.fn(),
}));

const { createEntry, updateEntry, deleteEntry, listEntries } =
  await import("../services/entriesService.js");
const { findById } = await import("../repositories/entriesRepository.js");
const { getAll } = await import("../repositories/entriesRepository.js");

test("createEntry rejects a missing title", async () => {
  const result = await createEntry({ title: "", body: "something" });
  expect(result.ok).toBe(false);
});

test("createEntry saves a valid entry and returns its DTO", async () => {
  const result = await createEntry({ title: "Groceries", body: "Milk, eggs" });
  expect(result.ok).toBe(true);
  expect(result.value).toEqual({
    id: "fake-id",
    title: "Groceries",
    body: "Milk, eggs",
  });
});

test("updateEntry returns a 404-shaped Err when the entry does not exist", async () => {
  findById.mockResolvedValueOnce(null);
  const result = await updateEntry("00000000000000", { title: "x", body: "y" });
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(404);
});

test("deleteEntry returns a 404-shaped Err when the entry does not exist", async () => {
  findById.mockResolvedValueOnce(null);
  const result = await deleteEntry("00000000000000");
  expect(result.ok).toBe(false);
  expect(result.error.status).toBe(404);
});

test("listEntries returns entries sorted by title, alphabetically", async () => {
  getAll.mockResolvedValueOnce([
    { _id: "1", title: "Zebra", body: "z" },
    { _id: "2", title: "Apple", body: "a" },
    { _id: "3", title: "Mango", body: "m" },
  ]);
  const result = await listEntries();
  expect(result.map((entry) => entry.title)).toEqual([
    "Apple",
    "Mango",
    "Zebra",
  ]);
});
