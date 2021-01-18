function requester(parent, args, context) {
  return context.prisma.newPart
    .findUnique({ where: { id: parent.id } })
    .requester();
}

function planner(parent, args, context) {
  return context.prisma.newPart
    .findUnique({ where: { id: parent.id } })
    .planner();
}

function tester(parent, args, context) {
  return context.prisma.newPart
    .findUnique({ where: { id: parent.id } })
    .tester();
}

function vendor(parent, args, context) {
  return context.prisma.newPart
    .findUnique({ where: { id: parent.id } })
    .vendor();
}

module.exports = {
  requester,
  planner,
  tester,
  vendor,
};
