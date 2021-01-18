async function feed(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { description: { contains: args.filter } },
          { url: { contains: args.filter } },
        ],
      }
    : {};

  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  });

  const count = await context.prisma.link.count({ where });

  return {
    id: "main-feed",
    links,
    count,
  };
}

async function newPartList(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { model: { contains: args.filter } },
          { partNo: { contains: args.filter } },
        ],
      }
    : {};

  const lists = await context.prisma.newPart.findMany({ where });

  const count = await context.prisma.newPart.count({ where });

  return {
    id: "newpart-lists",
    lists,
    count,
  };
}

async function partList(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { partName: { contains: args.filter } },
          { partNo: { contains: args.filter } },
        ],
      }
    : {};

  const lists = await context.prisma.part.findMany({ where });

  const count = await context.prisma.part.count({ where });

  return {
    id: "part-lists",
    lists,
    count,
  };
}

async function userList(parent, args, context, info) {
  const where = args.filter
    ? {
        OR: [
          { name: { contains: args.filter } },
          { department: { contains: args.filter } },
        ],
      }
    : {};

  const lists = await context.prisma.user.findMany({ where });

  const count = await context.prisma.user.count({ where });

  return {
    id: "user-lists",
    lists,
    count,
  };
}

module.exports = {
  feed,
  newPartList,
  partList,
  userList,
};
