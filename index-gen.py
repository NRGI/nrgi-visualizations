import os.path

def main():

    root_dir = './'
    template = '''<!DOCTYPE html>
    <html lang="eng">

      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Directory</title>

        <!-- Bootstrap CSS -->
        <link rel="stylesheet" type="text/css" href="%s/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Open+Sans:400,600">
        <link rel="stylesheet" type="text/css" href="%s/css/style.css"/>
        <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
          <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
        <![endif]-->
      </head>
      <body>
        <h2>Directory</h2>
        <hr>
        <ul>
          %s
        </ul>
      </body>
    </html>'''


    for (source_dir, dir_list, file_list) in os.walk(root_dir):
        if './.git' in source_dir \
        or './scripts' in source_dir \
        or './css' in source_dir \
        or './assets' in source_dir \
        or '/data' in source_dir:
            pass
        elif source_dir == './':
            dir_li = ''
            for index, sub_dir in enumerate(dir_list):
                if sub_dir[0] == '.' or sub_dir == 'css' or sub_dir == 'assets' or sub_dir == 'scripts':
                    pass
                elif index == len(dir_list) - 1:
                    dir_li = dir_li + '<li><a href="./' + sub_dir + '/index.html">' + sub_dir.title() + '</a></li>'
                else:
                    dir_li = dir_li + '<li><a href="./' + sub_dir + '/index.html">' + sub_dir.title() + '</a></li>\n      '
            replacements = ('.', '.', dir_li)
            with open('index.html', 'w') as index_file:
                index_file.write(template  % replacements)
        else:
            print 'index for ', source_dir
            file_li = ''
            for index, end_point in enumerate(file_list):
                if end_point == 'index.html' or '.js' in end_point:
                    pass
                elif index == len(file_list) - 1:
                    file_li = file_li + '<li><a href="./' + end_point + '">' + end_point.replace('.html', '').title() + '</a></li>'
                else:
                    file_li = file_li + '<li><a href="./' + end_point + '">' + end_point.replace('.html', '').title() + '</a></li>\n      '
            replacements = ('..', '..', file_li)
            with open(source_dir + '/index.html', 'w') as index_file:
                index_file.write(template  % replacements)

if __name__ == '__main__':
    main()
