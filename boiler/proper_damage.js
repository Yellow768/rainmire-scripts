

function calculateDamage(baseDamage, entity, source, knockback) {
    if (knockback == undefined) knockback = -1
    var damage
    var EPF = 0
    if (entity.type == 1) {
        if (source) {
            if (entity.getMCEntity().m_21254_() && canSeeEntity(entity, source, 150)) {
                entity.world.playSoundAt(entity.pos, "minecraft:item.shield.block", 1, Math.random() + .4)
                entity.getOffhandItem().setDamage(entity.getOffhandItem().getDamage() + baseDamage)
                return 0
            }
        }
        var defencePoints = 0
        var totalToughness = 0
        for (var i = 0; i < 4; i++) {
            var Piece = entity.getArmor(i);
            if (Piece.isEmpty()) continue
            var armor = Piece.getMCItemStack().m_41720_().m_40404_()
            var toughness = Piece.getMCItemStack().m_41720_().m_40405_()
            defencePoints += armor
            totalToughness += toughness
            if (Piece.isEnchanted()) {
                var enchantments = Piece.getItemNbt().getCompound("tag").getList("Enchantments", 10)
                for (var e = 0; e < enchantments.length; e++) {
                    if (enchantments[e].getString("id") == "minecraft:protection") {
                        EPF += enchantments[e].getInteger("lvl")
                    }
                }
            }
        }
        var protectionEnchantment = Math.min(EPF, 20) / 25

        damage = baseDamage * (1 - (Math.min(20, Math.max(defencePoints / 5, defencePoints - ((4 * baseDamage) / totalToughness + 8)))) / 25)
        damage -= damage * protectionEnchantment

    }
    if (entity.type == 2) {
        damage = baseDamage * entity.getStats().getResistance(0)
    }

    if (damage && knockback != -1) { entity.knockback(knockback, GetAngleTowardsEntity(source, entity)) }
    return damage

}