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

function vender(parent, args, context) {
  return context.prisma.newPart
    .findUnique({ where: { id: parent.id } })
    .vender();
}

module.exports = {
  requester,
  planner,
  tester,
  vender,
};
