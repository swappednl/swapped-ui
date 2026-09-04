/**
 * Keuzelijst met een eigen paneel.
 *
 * Een native <select> laat de openklappende lijst door het besturingssysteem
 * tekenen: die is niet te stylen en heeft geen zoekveld. Deze variant tekent de
 * lijst zelf en houdt de waarde in een verborgen veld, zodat het formulier
 * precies hetzelfde blijft posten als voorheen.
 *
 * Het paneel staat `fixed` en wordt bij openen uitgerekend. Dat is nodig omdat
 * de factuurregels in een tabel met `overflow-x-auto` staan: een absoluut
 * geplaatst paneel zou daar tegen de rand worden afgeknipt.
 */
export default function dropdown(config = {}) {
    return {
        open: false,
        query: '',
        value: config.value ?? '',
        options: config.options ?? [],
        searchable: config.searchable ?? false,
        placeholder: config.placeholder ?? '— kies —',
        disabled: config.disabled ?? false,
        create: config.create ?? null,
        highlighted: 0,
        panel: {},
        creating: false,
        createError: '',

        get filtered() {
            const q = this.query.trim().toLowerCase()

            if (q === '') {
                return this.options
            }

            return this.options.filter((o) => `${o.label} ${o.hint ?? ''}`.toLowerCase().includes(q))
        },

        get selected() {
            return this.options.find((o) => String(o.value) === String(this.value)) ?? null
        },

        get label() {
            return this.selected ? this.selected.label : this.placeholder
        },

        isSelected(option) {
            return String(option.value) === String(this.value)
        },

        /**
         * De toevoegen-regel verschijnt pas als je iets hebt getypt dat er nog
         * niet is. Zonder naam valt er niets aan te maken, en bij een exacte
         * treffer wil je die kiezen in plaats van een dubbele aanleggen.
         */
        get canCreate() {
            const q = this.query.trim()

            return this.create !== null
                && q !== ''
                && ! this.options.some((o) => o.label.toLowerCase() === q.toLowerCase())
        },

        async createOption() {
            if (this.creating) {
                return
            }

            this.creating = true
            this.createError = ''

            try {
                const response = await fetch(this.create.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                    },
                    body: JSON.stringify({ ...(this.create.payload ?? {}), name: this.query.trim() }),
                })

                const body = await response.json().catch(() => ({}))

                if (! response.ok) {
                    throw new Error(Object.values(body.errors ?? {}).flat()[0] ?? body.message ?? 'Toevoegen lukte niet.')
                }

                this.options = [...this.options, body].sort((a, b) => a.label.localeCompare(b.label, 'nl'))
                this.choose(body)
            } catch (error) {
                this.createError = error.message
            } finally {
                this.creating = false
            }
        },

        toggle() {
            this.open ? this.close() : this.show()
        },

        show() {
            if (this.disabled) {
                return
            }

            this.query = ''
            this.createError = ''
            this.open = true
            this.highlighted = Math.max(0, this.filtered.findIndex((o) => this.isSelected(o)))
            this.place()

            this.$nextTick(() => {
                this.searchable ? this.$refs.search?.focus() : this.scrollToHighlighted()
            })
        },

        close() {
            if (! this.open) {
                return
            }

            this.open = false
            this.$refs.trigger?.focus()
        },

        choose(option) {
            this.value = option.value
            this.close()
        },

        clear() {
            this.value = ''
            this.close()
        },

        /** Onder de knop, of erboven als daar meer ruimte is. */
        place() {
            const r = this.$refs.trigger.getBoundingClientRect()
            const ruimteOnder = window.innerHeight - r.bottom
            const hoogte = Math.min(320, Math.max(180, ruimteOnder - 16))
            const omhoog = ruimteOnder < 220 && r.top > ruimteOnder

            // Een smalle knop krijgt een breder paneel. Rechts in beeld zou dat
            // buiten het scherm vallen, dus lijnt het dan rechts uit.
            const breedte = Math.max(r.width, 224)
            const links = Math.max(8, Math.min(r.left, window.innerWidth - breedte - 8))

            this.panel = {
                position: 'fixed',
                left: `${links}px`,
                width: `${breedte}px`,
                maxHeight: `${omhoog ? Math.min(320, r.top - 16) : hoogte}px`,
                ...(omhoog ? { bottom: `${window.innerHeight - r.top + 4}px` } : { top: `${r.bottom + 4}px` }),
            }
        },

        move(step) {
            const n = this.filtered.length

            if (! n) {
                return
            }

            this.highlighted = (this.highlighted + step + n) % n
            this.$nextTick(() => this.scrollToHighlighted())
        },

        scrollToHighlighted() {
            this.$refs.list?.children[this.highlighted]?.scrollIntoView({ block: 'nearest' })
        },

        pick() {
            const option = this.filtered[this.highlighted]

            if (option) {
                this.choose(option)

                return
            }

            // Niets in de lijst maar wel iets getypt: dan bedoel je toevoegen.
            if (this.canCreate) {
                this.createOption()
            }
        },
    }
}
