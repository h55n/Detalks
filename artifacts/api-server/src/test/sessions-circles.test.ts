import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { Client, startTestServer, signup, type TestServer } from "./helpers";
import { kavachScan } from "../lib/kavach";

let server: TestServer;
before(async () => {
  server = await startTestServer();
});
after(async () => {
  await server.close();
});

test("kavach flags crisis language but not ordinary talk", () => {
  assert.equal(kavachScan("I want to kill myself").flagged, true);
  assert.equal(kavachScan("thinking about suicide").flagged, true);
  assert.equal(kavachScan("everyone would be better off without me").flagged, true);
  assert.equal(kavachScan("I don't want to live anymore").flagged, true);

  assert.equal(kavachScan("that exam killed me").flagged, false);
  assert.equal(kavachScan("I feel sad about my marks").flagged, false);
  assert.equal(kavachScan("dying of laughter at that joke").flagged, false);
  assert.equal(kavachScan("I killed it at the presentation today").flagged, false);
});

test("a session flows start, message, reply, history, end", async () => {
  const client = new Client(server.baseUrl);
  await signup(client, "session@example.com");

  const started = await client.post("/api/sessions", { arrivalState: "Feeling steady" });
  assert.equal(started.status, 201);
  const session = started.json.session as { id: string };
  const opening = started.json.messages as { role: string }[];
  assert.equal(opening[0].role, "companion");

  const sent = await client.post(`/api/sessions/${session.id}/messages`, {
    content: "Exams are weighing on me.",
  });
  assert.equal(sent.status, 201);
  assert.equal(sent.json.flagged, false);

  const history = await client.get(`/api/sessions/${session.id}/messages`);
  const messages = history.json.messages as { role: string }[];
  assert.equal(messages.length, 3);

  const ended = await client.post(`/api/sessions/${session.id}/end`, {
    postMood: 4,
    reflection: "Talking helped.",
  });
  assert.equal(ended.status, 200);

  const afterEnd = await client.post(`/api/sessions/${session.id}/messages`, {
    content: "Anyone there?",
  });
  assert.equal(afterEnd.status, 409);

  const list = await client.get("/api/sessions");
  const sessions = list.json.sessions as { id: string; messageCount: number; durationMin: number }[];
  assert.equal(sessions.length, 1);
  assert.equal(sessions[0].messageCount, 3);
  assert.ok(sessions[0].durationMin >= 1);

  // Ending with a post-session mood also logs a check-in.
  const progress = await client.get("/api/progress");
  assert.equal(progress.json.streak, 1);
});

test("kavach answers crisis messages with helplines, not the model", async () => {
  const client = new Client(server.baseUrl);
  await signup(client, "crisis@example.com");
  const started = await client.post("/api/sessions", { arrivalState: "Carrying something heavy" });
  const session = started.json.session as { id: string };

  const sent = await client.post(`/api/sessions/${session.id}/messages`, {
    content: "I want to kill myself",
  });
  assert.equal(sent.status, 201);
  assert.equal(sent.json.flagged, true);
  const reply = (sent.json.companionMessage as { content: string }).content;
  assert.match(reply, /14416/);
  assert.match(reply, /1800-599-0019/);
});

test("circles list, post anonymously, and like", async () => {
  const a = new Client(server.baseUrl);
  const b = new Client(server.baseUrl);
  const userA = await signup(a, "circle-a@example.com");
  await signup(b, "circle-b@example.com");

  const circles = await a.get("/api/circles");
  assert.equal(circles.status, 200);
  assert.equal((circles.json.circles as unknown[]).length, 6);

  const posted = await a.post("/api/circles/academic/posts", {
    content: "Submitted at 4am. Hollow instead of relieved.",
  });
  assert.equal(posted.status, 201);
  const post = posted.json.post as { id: string; alias: string };
  assert.equal(post.alias, userA.alias);

  const list = await b.get("/api/circles/academic/posts");
  const posts = list.json.posts as { id: string; content: string; likes: number; likedByMe: boolean }[];
  assert.equal(posts.length, 1);
  assert.equal(posts[0].likes, 0);

  const liked = await b.post(`/api/circles/posts/${post.id}/like`);
  assert.equal(liked.json.likes, 1);
  assert.equal(liked.json.likedByMe, true);

  const unliked = await b.post(`/api/circles/posts/${post.id}/like`);
  assert.equal(unliked.json.likes, 0);
  assert.equal(unliked.json.likedByMe, false);

  const bogus = await a.get("/api/circles/not-a-circle/posts");
  assert.equal(bogus.status, 404);
});
