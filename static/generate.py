slugs = ['codeplearn', 'love', 'ycc1',  'hacktoberfest2019',
         'bkkjs14', 'hacktoberfest2020', 'graphql', 'learn',
         'polaryz1', 'marshmallow', 'wind', 'svelte1',
         ]


for slug in slugs:
    with open('hacks/'+slug+'.md', "w") as f:
        f.write("---\n")
        f.write(f"name: {slug}\n")
        f.write("location:\n")
        f.write("date:\n")
        f.write("by: ['Creatorsgarten']\n")
        f.write("---""")
