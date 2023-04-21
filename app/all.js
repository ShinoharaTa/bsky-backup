import bsky from "@atproto/api";
const { BskyAgent } = bsky;
const agent = new BskyAgent({ service: "https://bsky.social" });
import fs from "fs";
import path from "path";

async function getall(repo, cursor = null) {
  const request = {
    repo: repo,
    collection: "app.bsky.feed.post",
    limit: 100,
  };
  if (cursor) request.cursor = cursor;
  const { data } = await agent.api.com.atproto.repo.listRecords(request);
  let response = data.records;
  console.log(data.records.length);
  if (data.cursor) {
    const res = await getall(repo, data.cursor);
    response = response.concat(res);
  }
  console.log(response.length);
  return response;
}

const userlist = JSON.parse(fs.readFileSync("./userlist.json", "utf-8"));
const fileout = [];
for (const user of userlist) {
  const data = await getall(user);
  fileout.push({
    handle: user,
    records: data,
  });
}
const outputPath = path.join(process.cwd(), "out", "result.json");
fs.writeFileSync(outputPath, JSON.stringify(fileout, null, 2));
// console.log(data.length);
