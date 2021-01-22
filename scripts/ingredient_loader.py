processed_r = open('drinks_with_ingredients.tsv', 'r')
processed = open('drinks_with_ingredients.tsv', 'a')
drinks = open('drinks.tsv', 'r')

line = None
# Get last line of the processed file, so we can pick up where we left off.
for line in processed_r:
  pass
last_line_name = line and line.split('\t')[0]

# Seek to leave off place in source file
current_name = None
new_line = drinks.readline()
while last_line_name and last_line_name != current_name:
  # Find the last drink processed in the input file
  if not new_line:
    break
  current_name = new_line.split('\t')[0]
  new_line = drinks.readline()

while current_name and last_line_name == current_name:
  # Advance to end of last drink processed
  new_line = drinks.readline()
  current_name = new_line.split('\t')[0]
  # On termination of above loop, new_line is the first line of the next drink to process


def process_drink(init_line):
  (canonical_name, name, book, ingredient) = init_line.split('\t')
  next_line = init_line
  next_name = canonical_name
  ingredients = []
  while next_name == canonical_name:
    ingredients.append(next_line.split('\t')[3])
    next_line = drinks.readline().strip()
    next_name = next_line.split('\t')[0]

  print("Processing %s" % canonical_name)
  amounted = []
  for ingredient in ingredients:
    amt = input("%s amount: " % ingredient) or ".75"
    unit = input("%s unit: " % ingredient) or 'oz'
    amounted.append('\t'.join([canonical_name, name, book, ingredient, amt, unit]) + '\n')

  processed.writelines(amounted)
  # Return the next line so we can feed it in to start again
  return next_line

# Need to strip to avoid breaking with line
next_drink = process_drink(new_line.strip())
while next_drink:
  # Comes back already stripped
  next_drink = process_drink(next_drink)