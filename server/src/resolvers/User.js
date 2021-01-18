function links(parent, args, context) {
  return context.prisma.user.findUnique({ where: { id: parent.id } }).links();
}

function requesterNewParts(parent, args, context) {
  return context.prisma.user
    .findUnique({ where: { id: parent.id } })
    .requesterNewParts();
}

module.exports = {
  links,
  requesterNewParts,
};
