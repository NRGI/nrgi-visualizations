#!/usr/bin/python
""" Converts eiti csv to json """
import json
import csv
# import sys
# import pycountry

def main():
    """ main function """
    with open('./source_data.csv', 'rU') as infile:
        csv_reader = csv.reader(infile, delimiter=',', quotechar='"')

        header = next(csv_reader)
        # lkey = {
        #     str(header[i]).replace("text:u", "").replace("'", ""): i for i in range(0, len(header))
        #     }
        ikey = {
            i: str(header[i]).replace("text:u", "").replace("'", "") for i in range(0, len(header))
            }
        num_cols = len(next(csv_reader))
        abs_index_list = {}
        vol_index_list = {}

        current_country = 'none'
        abs_json_data = []
        vol_json_data = []

        for row in csv_reader:
            if row[0] == current_country:
                pass
            else:
                current_country = row[0]
                current_country_id = row[1]
                current_var = row[2]
                for col in range(3, num_cols):
                    if row[col] == '':
                        value = None
                    else:
                        try:
                            value = float(row[col])
                        except ValueError, e:
                            value = None
                    if current_var == 'GGExp' or current_var == 'GGRev':
                        if current_country_id+ikey[col] not in abs_index_list:
                            abs_json_data.append({
                                "name": current_country,
                                'id': current_country_id,
                                "year": ikey[col],
                                current_var: value
                                })
                            abs_index_list[current_country_id+ikey[col]] = len(abs_json_data)-1
                        elif current_country_id+ikey[col] in abs_index_list:
                            abs_json_data[abs_index_list[current_country_id+ikey[col]]][current_var] = value
                    elif current_var == 'GGExpCh' or current_var == 'GGExpCh':
                        if current_country_id+ikey[col] not in vol_index_list:
                            vol_json_data.append({
                                "name": current_country,
                                'id': current_country_id,
                                "year": ikey[col],
                                current_var: value
                                })
                            vol_index_list[current_country_id+ikey[col]] = len(vol_json_data)-1
                        elif current_country_id+ikey[col] in vol_index_list:
                            vol_json_data[vol_index_list[current_country_id+ikey[col]]][current_var] = value

        # write out archive of update into archive folder
        with open('./abs_data.json', 'w') as out1:
            out1.write(json.dumps(abs_json_data, indent=4, separators=(',', ':')))
        with open('./vol_data.json', 'w') as out1:
            out1.write(json.dumps(vol_json_data, indent=4, separators=(',', ':')))

if __name__ == "__main__":
    main()
    # main(sys.argv[1:])
