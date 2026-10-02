from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.section import WD_ORIENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

OUT='/project/outputs/NOVA_MVP_EXECUTIVE_PRODUCT_PLAN.docx'
NAVY='0F1E3F'; BLUE='B7E4F7'; WHITE='FFFFFF'

def xml(tag, **attrs):
    e=OxmlElement(tag)
    for k,v in attrs.items(): e.set(qn(k),str(v))
    return e

def shade(cell, fill):
    pr=cell._tc.get_or_add_tcPr(); pr.append(xml('w:shd', **{'w:val':'clear','w:fill':fill}))

def border(cell, color=BLUE, size='8'):
    pr=cell._tc.get_or_add_tcPr(); b=xml('w:tcBorders')
    for edge in ('top','left','bottom','right'):
        b.append(xml('w:'+edge, **{'w:val':'single','w:sz':size,'w:color':color}))
    shd=pr.find(qn('w:shd'))
    if shd is not None: pr.insert(list(pr).index(shd), b)
    else: pr.append(b)

def rtl_paragraph(p, align=WD_ALIGN_PARAGRAPH.RIGHT):
    p.alignment=align
    pPr=p._p.get_or_add_pPr()

def text(p, value, bold=False, size=10, color=NAVY, align=WD_ALIGN_PARAGRAPH.RIGHT):
    rtl_paragraph(p,align)
    r=p.add_run(value); r.bold=bold; r.font.name='Arial'; r.font.size=Pt(size); r.font.color.rgb=RGBColor.from_string(color)
    r._element.get_or_add_rPr().append(xml('w:rtl', **{'w:val':'1'}))
    return r

def set_table_rtl(t):
    t.alignment=WD_TABLE_ALIGNMENT.CENTER; t.autofit=False
    pr=t._tbl.tblPr
    bidi=xml('w:bidiVisual', **{'w:val':'1'})
    pr.insert(0, bidi)

def no_split(row): row._tr.get_or_add_trPr().append(xml('w:cantSplit'))
def header_repeat(row): row._tr.get_or_add_trPr().append(xml('w:tblHeader', **{'w:val':'true'}))

def add_heading(doc, title, number=None):
    p=doc.add_paragraph(); p.paragraph_format.space_before=Pt(10); p.paragraph_format.space_after=Pt(10)
    if number:
        text(p,number+'   ',True,11,BLUE,WD_ALIGN_PARAGRAPH.RIGHT)
    text(p,title,True,21,NAVY,WD_ALIGN_PARAGRAPH.RIGHT)
    p.paragraph_format.border_bottom = None
    return p

def add_rule(doc):
    p=doc.add_paragraph(); p.paragraph_format.space_after=Pt(8)

def make_table(doc, headers, rows, widths, fs=8.5, header_fill=NAVY):
    t=doc.add_table(rows=1, cols=len(headers)); set_table_rtl(t)
    h=t.rows[0]
    for i,label in enumerate(headers):
        c=h.cells[i]; c.width=Inches(widths[i]); shade(c,header_fill); border(c,header_fill)
        text(c.paragraphs[0],label,True,fs,WHITE,WD_ALIGN_PARAGRAPH.CENTER); c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
    header_repeat(h)
    for index,row in enumerate(rows):
        r=t.add_row(); no_split(r)
        for i,value in enumerate(row):
            c=r.cells[i]; c.width=Inches(widths[i]); shade(c,WHITE if index%2==0 else 'F4FBFE'); border(c)
            align=WD_ALIGN_PARAGRAPH.CENTER if i in (0,3,4) else WD_ALIGN_PARAGRAPH.RIGHT
            text(c.paragraphs[0],str(value),False,fs,NAVY,align); c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
    return t

def page(doc): doc.add_page_break()

def card_table(doc, items):
    t=doc.add_table(rows=1,cols=3); set_table_rtl(t)
    for idx,(num,priority,title,lines,note) in enumerate(items):
        c=t.cell(0,idx); c.width=Inches(3.42); shade(c,'F4FBFE'); border(c,NAVY,'12')
        text(c.paragraphs[0],num,True,24,BLUE,WD_ALIGN_PARAGRAPH.RIGHT)
        text(c.add_paragraph(),priority,True,21,NAVY,WD_ALIGN_PARAGRAPH.RIGHT)
        text(c.add_paragraph(),title,True,10,NAVY,WD_ALIGN_PARAGRAPH.RIGHT)
        for line in lines: text(c.add_paragraph(),line,False,8.6,NAVY,WD_ALIGN_PARAGRAPH.RIGHT)
        if note: text(c.add_paragraph(),note,True,8,NAVY,WD_ALIGN_PARAGRAPH.RIGHT)
    return t

doc=Document(); zoom=doc.settings.element.find(qn('w:zoom'))
if zoom is not None: zoom.set(qn('w:percent'),'100')
sec=doc.sections[0]; sec.orientation=WD_ORIENT.LANDSCAPE; sec.page_width=Inches(11.69); sec.page_height=Inches(8.27)
sec.left_margin=sec.right_margin=Inches(.55); sec.top_margin=Inches(.55); sec.bottom_margin=Inches(.55)
normal=doc.styles['Normal']; normal.font.name='Arial'; normal.font.size=Pt(10)
# header/footer
hp=sec.header.paragraphs[0]; text(hp,'NOVA  |  MVP PRODUCT DEVELOPMENT PLAN',True,8,NAVY,WD_ALIGN_PARAGRAPH.LEFT)
fp=sec.footer.paragraphs[0]; fp.alignment=WD_ALIGN_PARAGRAPH.CENTER
r=fp.add_run('NOVA  •  PRODUCT EXECUTION BRIEF  •  '); r.font.size=Pt(8); r.font.color.rgb=RGBColor.from_string(NAVY)
fld=OxmlElement('w:fldSimple'); fld.set(qn('w:instr'),'PAGE'); fp._p.append(fld)
# 01 Cover
for _ in range(3): doc.add_paragraph()
cover=doc.add_table(rows=1,cols=1); set_table_rtl(cover); c=cover.cell(0,0); shade(c,NAVY); border(c,NAVY)
for _ in range(3): c.add_paragraph()
text(c.paragraphs[0],'NOVA',True,42,WHITE,WD_ALIGN_PARAGRAPH.CENTER)
text(c.add_paragraph(),'MVP PRODUCT DEVELOPMENT PLAN',True,20,WHITE,WD_ALIGN_PARAGRAPH.CENTER)
text(c.add_paragraph(),'نقشه توسعه محصول SaaS آموزشی نوا',False,15,BLUE,WD_ALIGN_PARAGRAPH.CENTER)
text(c.add_paragraph(),'14-DAY SPRINT',True,12,WHITE,WD_ALIGN_PARAGRAPH.CENTER)
for _ in range(3): c.add_paragraph()
p=doc.add_paragraph(); text(p,'PRODUCT EXECUTION  /  14 DAYS  /  MVP DELIVERY',True,9,NAVY,WD_ALIGN_PARAGRAPH.CENTER)
page(doc)
# 02 Introduction
add_heading(doc,'NOVA','01'); add_rule(doc)
for title,body in [('«Nova چیست؟»','Nova یک SaaS آموزشی در حوزه هوش مصنوعی است که برای دانش‌آموزان حدود ۹ تا ۱۳ سال طراحی شده است. کاربر در Nova مفاهیم مقدماتی هوش مصنوعی را از طریق آموزش ویدئویی، شخصیت آموزشی، چالش‌ها و آزمون‌ها یاد می‌گیرد و روند پیشرفت خود را مشاهده می‌کند.'),('«چرا Nova؟»','نام Nova کوتاه، مدرن و قابل توسعه است و مفهوم آغاز یک اتفاق جدید و نوآوری را منتقل می‌کند.')]:
    t=doc.add_table(rows=1,cols=1); set_table_rtl(t); c=t.cell(0,0); shade(c,'F4FBFE'); border(c,NAVY,'12')
    text(c.paragraphs[0],title,True,15,NAVY); text(c.add_paragraph(),body,False,12,NAVY)
    doc.add_paragraph()
page(doc)
# 03 priorities
add_heading(doc,'PRODUCT DEVELOPMENT PRIORITIES','02'); add_rule(doc)
card_table(doc,[
 ('01','P0','CORE MVP',['۱. ویدئوهای دوره','۲. مرتبط کردن تیترهای دوره با ویدئوها','۳. API','۴. مرتبط کردن چالش‌ها با ویدئوها','۵. مرتبط کردن آزمون‌ها با ویدئوها','۶. ذخیره اطلاعات + پرداخت + اعتبارسنجی پرداخت','۷. اتصال درگاه پرداخت'],''),
 ('02','P1','PRODUCT GROWTH',['۱. اضافه کردن کانال و پیج','۲. سیستم گزارش والدین — ۲ روز','۳. اضافه کردن کاراکترهای بیشتر'],''),
 ('03','P2','ADVANCED FEATURES',['۱. صوتی کردن Chatbot — ۳ روز'],'VR فعلاً در این Sprint قرار ندارد.')])
page(doc)
# 04+ task table
add_heading(doc,'TASK DEFINITION','03'); add_rule(doc)
taskrows=[
['P0','ویدئوهای دوره','دانش‌آموز بتواند محتوای دوره را مشاهده و یاد بگیرد','۱ روز','—','هر ۱۶ ویدئو آماده، بارگذاری و قابل پخش باشند.'],
['P0','مرتبط کردن تیترهای دوره با ویدئوها','دانش‌آموز بتواند از هر تیتر به محتوای مرتبط برسد','۱ روز','ویدئوها','تمام تیترها به ویدئوی صحیح متصل و تست شده باشند.'],
['P0','API','بخش‌های مختلف Nova بتوانند اطلاعات موردنیاز را با یکدیگر تبادل کنند','۱ روز','ساختار دوره','APIهای موردنیاز پیاده‌سازی و تست شده باشند.'],
['P0','مرتبط کردن چالش‌ها با ویدئوها','دانش‌آموز بتواند Challenge مرتبط با هر بخش را انجام دهد','۱ روز','API + ویدئوها','Challengeها به محتوای صحیح متصل و قابل اجرا باشند.'],
['P0','مرتبط کردن آزمون‌ها با ویدئوها','دانش‌آموز بتواند آزمون مرتبط با محتوای یادگرفته‌شده را انجام دهد','۱ روز','API + ویدئوها','آزمون‌ها متصل و نتیجه آن‌ها ثبت شود.'],
['P0','ذخیره اطلاعات + پرداخت + اعتبارسنجی','اطلاعات کاربر و وضعیت پرداخت صحیح مدیریت شود','۱ روز','API','اطلاعات ذخیره و پرداخت تأییدنشده رد شود.'],
['P0','اتصال درگاه پرداخت','کاربر بتواند پرداخت واقعی انجام دهد','۱ روز','سیستم پرداخت','درگاه متصل و پرداخت آزمایشی موفق باشد.'],
['P1','اضافه کردن کانال و پیج','کاربر بتواند به کانال و پیج دسترسی پیدا کند','۱ روز','صفحه اصلی','لینک‌ها اضافه و تست شده باشند.'],
['P1','سیستم گزارش والدین — بخش اول','اطلاعات لازم برای گزارش فعالیت دانش‌آموز آماده شود','۱ روز','ذخیره اطلاعات','ساختار گزارش آماده باشد.'],
['P1','سیستم گزارش والدین — بخش دوم','والد بتواند فعالیت یا عدم فعالیت دانش‌آموز را پیگیری کند','۱ روز','روز ۹','گزارش روزانه و پیام عدم ورود فعال باشند.'],
['P1','اضافه کردن کاراکترهای بیشتر','دانش‌آموز بتواند از بین شخصیت‌های بیشتری انتخاب کند','۱ روز','سیستم کاراکتر','کاراکترهای جدید اضافه و قابل انتخاب باشند.'],
['P2','صوتی کردن Chatbot — بخش اول','تعامل صوتی اولیه ایجاد شود','۱ روز','Chatbot','زیرساخت صوتی آماده باشد.'],
['P2','صوتی کردن Chatbot — بخش دوم','تعامل صوتی کامل‌تر شود','۱ روز','روز ۱۲','قابلیت‌های اصلی صوتی کار کنند.'],
['P2','صوتی کردن Chatbot — بخش سوم','قابلیت صوتی آماده استفاده باشد','۱ روز','روز ۱۳','قابلیت صوتی نهایی تست شده باشد.'],
['P0','تست و Validation نهایی MVP','کاربر بتواند MVP را بدون ایرادات اصلی استفاده کند','۱ روز','تکمیل قابلیت‌ها','کل MVP تست و ایرادات اصلی رفع شده باشند.']]
make_table(doc,['P','Task','JTBD','زمان','وابستگی','DoD'],taskrows,[.45,1.75,2.35,.55,1.2,3.45],7.5)
page(doc)
# 05 execution
add_heading(doc,'14-DAY EXECUTION PLAN','04'); add_rule(doc)
execution=[['روز ۱','P0','ویدئوهای دوره','۱ روز','□'],['روز ۲','P0','مرتبط کردن تیترهای دوره با ویدئوها','۱ روز','□'],['روز ۳','P0','API','۱ روز','□'],['روز ۴','P0','مرتبط کردن چالش‌ها با ویدئوها','۱ روز','□'],['روز ۵','P0','مرتبط کردن آزمون‌ها با ویدئوها','۱ روز','□'],['روز ۶','P0','ذخیره اطلاعات + پرداخت + اعتبارسنجی','۱ روز','□'],['روز ۷','P0','اتصال درگاه پرداخت','۱ روز','□'],['روز ۸','P1','اضافه کردن کانال و پیج','۱ روز','□'],['روز ۹','P1','سیستم گزارش والدین — بخش اول','۱ روز','□'],['روز ۱۰','P1','سیستم گزارش والدین — بخش دوم','۱ روز','□'],['روز ۱۱','P1','اضافه کردن کاراکترهای بیشتر','۱ روز','□'],['روز ۱۲','P2','صوتی کردن Chatbot — بخش اول','۱ روز','□'],['روز ۱۳','P2','صوتی کردن Chatbot — بخش دوم','۱ روز','□'],['روز ۱۴','—','تست کامل MVP + رفع ایرادات','۱ روز','□']]
make_table(doc,['روز','P','Task','زمان','وضعیت'],execution,[1.1,.6,5.3,1,1],10)
p=doc.add_paragraph(); text(p,'روز ۱۴ فقط برای Testing، QA، Bug Fixing و MVP Validation است.',True,10,NAVY)
page(doc)
# 06 Tracking
add_heading(doc,'SPRINT DAILY TRACKING','05'); add_rule(doc)
tracking=[[f'روز {i}','', '□','□',''] for i in range(1,15)]
make_table(doc,['روز','Task','✓ انجام شد','✕ انجام نشد','توضیحات'],tracking,[1,3.4,1.35,1.35,2.9],10)
page(doc)
# 07 Validation
add_heading(doc,'MVP FINAL VALIDATION','06'); add_rule(doc)
t=doc.add_table(rows=1,cols=1); set_table_rtl(t); c=t.cell(0,0); shade(c,'F4FBFE'); border(c,NAVY,'12')
checks=['۱۶ ویدئو قابل پخش هستند.','تیترها به ویدئوهای صحیح متصل هستند.','APIها تست شده‌اند.','Challengeها متصل هستند.','آزمون‌ها متصل هستند.','اطلاعات کاربر ذخیره می‌شود.','پرداخت و اعتبارسنجی تست شده است.','درگاه پرداخت تست شده است.','کانال و پیج متصل هستند.','سیستم گزارش والدین تست شده است.','کاراکترهای جدید قابل انتخاب هستند.','Chatbot صوتی تست شده است.','کل مسیر کاربر تست شده است.','ایرادات اصلی رفع شده‌اند.','MVP آماده ارائه است.']
for i,item in enumerate(checks): text(c.paragraphs[0] if i==0 else c.add_paragraph(),'□  '+item,False,10,NAVY)
doc.add_paragraph()
t=doc.add_table(rows=1,cols=2); set_table_rtl(t)
for i,(title,definition) in enumerate([('JTBD\nJob To Be Done','«کاری که کاربر با استفاده از محصول می‌خواهد انجام دهد.»'),('DoD\nDefinition of Done','«معیارهایی که مشخص می‌کنند یک Task واقعاً تمام شده است.»')]):
    c=t.cell(0,i); shade(c,'F4FBFE'); border(c,NAVY,'12'); text(c.paragraphs[0],title,True,13,NAVY); text(c.add_paragraph(),definition,False,10,NAVY)
doc.save(OUT)
print(OUT)
