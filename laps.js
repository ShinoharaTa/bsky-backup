import bsky from "@atproto/api";
const { BskyAgent } = bsky;
const agent = new BskyAgent({ service: "https://bsky.social" });
import fs from "fs";
import path from "path";
import moment from "moment-timezone"

async function getall(repo, time, cursor = null) {
  const request = {
    repo: repo,
    collection: "app.bsky.feed.post",
    limit: 10,
  };
  if (cursor) request.cursor = cursor;
  const { data } = await agent.api.com.atproto.repo.listRecords(request);
  let response = data.records;
  const end = data.records.find(item => moment(item.value.createdAt).isBefore(time))
  if(!end){
    if (data.cursor) {
      const res = await getall(repo, time,data.cursor);
      response = response.concat(res);
    }
  }
  console.log(response.length);
  return response;
}

const userlist = JSON.parse(fs.readFileSync("./userlist.json", "utf-8"));
const fileout = [];
const end = moment().subtract(process.argv[2], 'minutes').toDate();
for (const user of userlist) {
  const data = await getall(user, end);
  const filtered = data.filter(item => moment(item.value.createdAt).isAfter(end))
  console.log(filtered);
  fileout.push({
    handle: user,
    records: filtered,
  });
}

const now = moment().tz("Asia/Tokyo").format("YYYYMMDD_HHmmss");

const outputPath = path.join(process.cwd(), "out", now + ".json");
fs.writeFileSync(outputPath, JSON.stringify(fileout, null, 2));
console.log(fileout);
