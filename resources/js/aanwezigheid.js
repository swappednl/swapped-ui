/**
 * Wie er online is, op één plek. De server rekent uit wat de stand is en hoe
 * die heet ("Online", "Afwezig sinds 14:32", "Offline sinds gisteren 17:40");
 * hier wordt hij alleen bewaard en uitgedeeld.
 *
 * Waarom een store en geen eigenschap van chatRoom: het stipje staat op
 * plekken die niets van elkaar weten — de berichtenstroom, de ledenlijst in
 * een modal (die buiten x-data staat), de zijbalk, het zijpaneel. Ze worden
 * gevoed door wie er toevallig aan het pollen is: de chatmodule elke vier
 * seconden, de zijbalk elke vijftien, het paneel elke vier.
 */
export function aanwezigheidStore() {
    return {
        // lid-id => { stand, label, gezien }
        leden: {},

        /** Wat een poll teruggaf erin schuiven (alleen wat erin staat). */
        stel(kaart) {
            if (! kaart) return

            this.leden = { ...this.leden, ...kaart }
        },

        stand(id, terugval = 'offline') {
            return this.leden[id]?.stand ?? terugval
        },

        label(id, terugval = '') {
            return this.leden[id]?.label ?? terugval
        },

        online(id) {
            return this.stand(id) === 'online'
        },

        /** Kleur van het stipje. Grijs = offline, dan is er niets te zien. */
        stip(id, terugval = 'offline') {
            return {
                online: 'bg-emerald-500',
                afwezig: 'bg-amber-400',
                offline: 'bg-slate-300',
            }[this.stand(id, terugval)] ?? 'bg-slate-300'
        },

        /** Tekstkleur voor de statusregel onder een naam. */
        tekst(id, terugval = 'offline') {
            return {
                online: 'text-emerald-600',
                afwezig: 'text-amber-600',
                offline: 'text-slate-400',
            }[this.stand(id, terugval)] ?? 'text-slate-400'
        },
    }
}
