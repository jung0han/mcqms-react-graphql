const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../utils");

async function post(parent, args, context, info) {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
  context.pubsub.publish("NEW_LINK", newLink);

  return newLink;
}

async function addNewPart(parent, args, context, info) {
  const { userId } = context;

  const newPart = await context.prisma.newPart.create({
    data: {
      model: args.model,
      partNo: args.partNo,
      vender: { connect: { id: Number(args.venderId) } },
      category: args.category,
      type: args.type,
      requester: { connect: { id: userId } },
      planner: { connect: { id: Number(args.plannerId) } },
      tester: { connect: { id: Number(args.testerId) } },
    },
  });

  return newPart;
}

async function addVender(parent, args, context, info) {
  const { userId } = context;

  const newPart = await context.prisma.newPart.create({
    data: {
      model: args.model,
      partNo: args.partNo,
      addedBy: { connect: { id: userId } },
    },
  });

  return newPart;
}

async function deletePost(parent, args, context, info) {
  // const delLink = await context.prisma.link.delete({
  //   where: { id: Number(args.id) },
  // });
  // console.log(delLink);

  // return delLink;

  // 계단식 삭제 지원 문제로 SQL로 삭제
  context.prisma.$queryRaw`delete from Link WHERE id = ${args.id};`;
}

async function signup(parent, args, context, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
}

async function vote(parent, args, context, info) {
  const { userId } = context;
  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId_unique: {
        linkId: Number(args.linkId),
        userId: userId,
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });
  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
}

module.exports = {
  addNewPart,
  addVender,
  post,
  deletePost,
  signup,
  login,
  vote,
};
