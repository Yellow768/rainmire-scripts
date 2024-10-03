function interact(e) {
    if (e.player.getMainhandItem().getItemNbt().getCompound("tag").getString("author") == "- E") {
        if (!e.player.hasFinishedQuest(10) && !e.player.hasActiveQuest(10)) {
            e.player.startQuest(10)
        }
    }
}