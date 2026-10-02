from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.section import WD_ORIENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

OUT='/project/outputs/NOVA_MVP_PRODUCT_DEVELOPMENT_PLAN.docx'
NAVY='0F1E3F'; BLUE='B7E4F7'; GREY='E9EDF3'; WHITE='FFFFFF'
doc=Document()
zoom=doc.settings.element.find(qn('w:zoom'))
if zoom is not None: zoom.set(qn('w:percent'),'100')
sec=doc.sections[0]
sec.orientation=WD_ORIENT.LANDSCAPE
sec.page_width, sec.page_height = Inches(11.69), Inches(8.27)
sec.left_margin=sec.right_margin=Inches(.55)
sec.top_margin=Inches(.55); sec.bottom_margin=Inches(.55)

styles=doc.styles
styles['Normal'].font.name='Arial'; styles['Normal']._element.rPr.rFonts.set(qn('w:eastAsia'),'Arial'); styles['Normal'].font.size=Pt(9)
for nm,size in [('Title',28),('Heading 1',18),('Heading 2',13)]:
 s=styles[nm]; s.font.name='Arial'; s.font.size=Pt(size); s.font.bold=True; s.font.color.rgb=RGBColor.from_string(NAVY)

def set_cell_shading(cell, fill):
 tcPr=cell._tc.get_or_add_tcPr(); shd=OxmlElement('w:shd'); shd.set(qn('w:val'),'clear'); shd.set(qn('w:fill'),fill); tcPr.append(shd)
def set_cell_border(cell,color='B7E4F7'):
 pass
def rtl(p,align=WD_ALIGN_PARAGRAPH.RIGHT):
 p.alignment=align
def add_text(p,text,bold=False,size=None,color=None,align=WD_ALIGN_PARAGRAPH.RIGHT):
 rtl(p,align); r=p.add_run(text); r.bold=bold; r.font.name='Arial'; r._element.rPr.rFonts.set(qn('w:cs'),'Arial'); r.font.size=Pt(size or 9)
 if color:r.font.color.rgb=RGBColor.from_string(color)
 return r
def add_heading(text,level=1):
 p=doc.add_paragraph(); p.paragraph_format.space_before=Pt(12); p.paragraph_format.space_after=Pt(5); add_text(p,text,True,18 if level==1 else 13,NAVY); return p
def repeat_header(row):
 trPr=row._tr.get_or_add_trPr(); el=OxmlElement('w:tblHeader'); el.set(qn('w:val'),'true'); trPr.append(el)
def cant_split(row):
 trPr=row._tr.get_or_add_trPr(); el=OxmlElement('w:cantSplit'); trPr.append(el)
def table(headers,rows,widths,font=8):
 t=doc.add_table(rows=1, cols=len(headers)); t.alignment=WD_TABLE_ALIGNMENT.CENTER; t.autofit=False
 for i,h in enumerate(headers):
  c=t.rows[0].cells[i]; c.width=Inches(widths[i]); set_cell_shading(c,NAVY); set_cell_border(c,NAVY)
  p=c.paragraphs[0]; add_text(p,h,True,font,WHITE,WD_ALIGN_PARAGRAPH.CENTER); c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
 repeat_header(t.rows[0])
 for ri,row in enumerate(rows):
  cells=t.add_row().cells; cant_split(t.rows[-1])
  for i,val in enumerate(row):
   c=cells[i]; c.width=Inches(widths[i]); set_cell_shading(c,WHITE if ri%2==0 else 'F7FAFC'); set_cell_border(c)
   p=c.paragraphs[0]; add_text(p,str(val),False,font,NAVY,WD_ALIGN_PARAGRAPH.CENTER if i in [0,1,3,5] else WD_ALIGN_PARAGRAPH.RIGHT)
   c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
 for row in t.rows:
  for c in row.cells:
   pass
 doc.add_paragraph().paragraph_format.space_after=Pt(3)
 return t

def page_break(): doc.add_page_break()
# Header footer
header=sec.header.paragraphs[0]; header.paragraph_format.space_after=Pt(4); header.paragraph_format.border_bottom= None
add_text(header,'NOVA  |  MVP PRODUCT DEVELOPMENT PLAN',True,8,NAVY,WD_ALIGN_PARAGRAPH.LEFT)
footer=sec.footer.paragraphs[0]; footer.alignment=WD_ALIGN_PARAGRAPH.CENTER
r=footer.add_run('NOVA  •  CONFIDENTIAL  |  '); r.font.size=Pt(8); r.font.color.rgb=RGBColor.from_string(NAVY)
fld=OxmlElement('w:fldSimple'); fld.set(qn('w:instr'),'PAGE'); footer._p.append(fld)
# Cover
for _ in range(5): doc.add_paragraph()
p=doc.add_paragraph(); add_text(p,'NOVA',True,42,NAVY,WD_ALIGN_PARAGRAPH.CENTER); p.paragraph_format.space_after=Pt(16)
p=doc.add_paragraph(); add_text(p,'MVP PRODUCT DEVELOPMENT PLAN',True,20,NAVY,WD_ALIGN_PARAGRAPH.CENTER)
p=doc.add_paragraph(); add_text(p,'نقشه توسعه محصول SaaS آموزشی نوا',False,14,NAVY,WD_ALIGN_PARAGRAPH.CENTER)
p=doc.add_paragraph(); add_text(p,'14-Day Sprint | Product Execution Plan',True,11,NAVY,WD_ALIGN_PARAGRAPH.CENTER)
doc.add_paragraph()
t=doc.add_table(rows=1,cols=1); c=t.cell(0,0); set_cell_shading(c,BLUE); set_cell_border(c,BLUE); add_text(c.paragraphs[0],'PRODUCT EXECUTION BRIEF',True,10,NAVY,WD_ALIGN_PARAGRAPH.CENTER)
page_break()
# Intro
add_heading('Nova چیست؟')
t=doc.add_table(rows=1,cols=1); c=t.cell(0,0); set_cell_shading(c,'F4FBFE'); set_cell_border(c); add_text(c.paragraphs[0],'«Nova یک SaaS آموزشی در حوزه هوش مصنوعی است که برای دانش‌آموزان حدود ۹ تا ۱۳ سال طراحی شده است. کاربر در Nova مفاهیم مقدماتی هوش مصنوعی را از طریق آموزش ویدئویی، شخصیت آموزشی، چالش‌ها و آزمون‌ها یاد می‌گیرد و روند پیشرفت خود را مشاهده می‌کند. این محصول علاوه بر ایجاد یک تجربه آموزشی تعاملی، مسیر ارتباط کاربر با دوره‌های اصلی و پیشرفته‌تر آموزشی را نیز فراهم می‌کند.»',False,11,NAVY)
add_heading('چرا Nova؟')
t=doc.add_table(rows=1,cols=1); c=t.cell(0,0); set_cell_shading(c,'F4FBFE'); set_cell_border(c); add_text(c.paragraphs[0],'«نام Nova کوتاه، مدرن و قابل توسعه است و مفهوم آغاز یک اتفاق جدید و نوآوری را منتقل می‌کند. این نام برای محصولی انتخاب شده که هدف آن ایجاد تجربه‌ای متفاوت و تعاملی برای ورود نسل جدید به دنیای هوش مصنوعی است.»',False,11,NAVY)
add_heading('Product Development Priorities')
t=doc.add_table(rows=1,cols=3); t.autofit=False
cards=[('P0 — CORE MVP',['۱. ویدئوهای دوره','۲. مرتبط کردن تیترهای دوره با ویدئوها','۳. API','۴. مرتبط کردن چالش‌ها با ویدئوها','۵. مرتبط کردن آزمون‌ها با ویدئوها','۶. ذخیره اطلاعات + پرداخت + اعتبارسنجی پرداخت','۷. اتصال درگاه پرداخت']),('P1 — PRODUCT GROWTH',['۱. اضافه کردن کانال و پیج','۲. سیستم گزارش والدین — ۲ روز','۳. اضافه کردن کاراکترهای بیشتر']),('P2 — ADVANCED',['۱. صوتی کردن Chatbot — ۳ روز'])]
for i,(title,items) in enumerate(cards):
 c=t.cell(0,i); c.width=Inches(3.45); set_cell_shading(c,'F4FBFE'); set_cell_border(c)
 p=c.paragraphs[0]; add_text(p,title,True,11,NAVY,WD_ALIGN_PARAGRAPH.CENTER)
 for item in items: add_text(c.add_paragraph(),item,False,9,NAVY)
p=doc.add_paragraph(); add_text(p,'Scope Note: VR در این Sprint قرار ندارد.',True,9,NAVY)
page_break()
# Execution
add_heading('14-Day Sprint Execution')
exec_rows=[
['روز 1','P0','ویدئوهای دوره','1 روز','—','□'],['روز 2','P0','مرتبط کردن تیترهای دوره با ویدئوها','1 روز','ویدئوهای دوره','□'],['روز 3','P0','API','1 روز','ساختار دوره','□'],['روز 4','P0','مرتبط کردن چالش‌ها با ویدئوها','1 روز','API + ویدئوها','□'],['روز 5','P0','مرتبط کردن آزمون‌ها با ویدئوها','1 روز','API + ویدئوها','□'],['روز 6','P0','ذخیره اطلاعات + پرداخت + اعتبارسنجی پرداخت','1 روز','API','□'],['روز 7','P0','اتصال درگاه پرداخت','1 روز','سیستم پرداخت','□'],['روز 8','P1','اضافه کردن کانال و پیج','1 روز','صفحه اصلی','□'],['روز 9','P1','سیستم گزارش والدین — بخش اول','1 روز','ذخیره اطلاعات','□'],['روز 10','P1','سیستم گزارش والدین — بخش دوم','1 روز','روز 9','□'],['روز 11','P1','اضافه کردن کاراکترهای بیشتر','1 روز','سیستم کاراکتر','□'],['روز 12','P2','صوتی کردن Chatbot — بخش اول','1 روز','Chatbot','□'],['روز 13','P2','صوتی کردن Chatbot — بخش دوم','1 روز','روز 12','□'],['روز 14','—','تست کامل MVP + رفع ایرادات','1 روز','تکمیل قابلیت‌های برنامه','□']]
table(['روز','P','Task','زمان','وابستگی','وضعیت'],exec_rows,[.7,.45,3.6,.7,2.8,.6],8.5)
p=doc.add_paragraph(); add_text(p,'روز ۱۴ روز کاریِ توسعه قابلیت جدید نیست؛ فقط برای Testing، QA، پیدا کردن Bug، رفع ایرادات و اطمینان از درست کار کردن کل MVP است.',True,9,NAVY)
page_break()
# DoD
defrows=[]
data=[
('P0','ویدئوهای دوره','دانش‌آموز بتواند محتوای دوره را مشاهده و یاد بگیرد.','ویدئوهای دوره','هر ۱۶ ویدئو ضبط، آماده، بارگذاری و قابل پخش باشند.'),('P0','مرتبط کردن تیترهای دوره با ویدئوها','دانش‌آموز بتواند از هر تیتر به محتوای مرتبط دسترسی داشته باشد.','ویدئوهای دوره','تمام تیترها به ویدئوی صحیح متصل و تست شده باشند.'),('P0','API','بخش‌های مختلف Nova بتوانند اطلاعات موردنیاز را با یکدیگر تبادل کنند.','ساختار دوره','APIهای موردنیاز پیاده‌سازی و تست شده باشند.'),('P0','مرتبط کردن چالش‌ها با ویدئوها','دانش‌آموز بتواند برای هر بخش، چالش مرتبط را انجام دهد.','API + ویدئوها','چالش‌های مربوط به هر بخش به محتوای صحیح متصل و قابل اجرا باشند.'),('P0','مرتبط کردن آزمون‌ها با ویدئوها','دانش‌آموز بتواند بعد از یادگیری محتوای مرتبط، آزمون را انجام دهد.','API + ویدئوها','آزمون‌ها به محتوای صحیح متصل باشند و نتیجه آزمون ذخیره شود.'),('P0','ذخیره اطلاعات + پرداخت + اعتبارسنجی پرداخت','اطلاعات کاربر و وضعیت پرداخت به شکل صحیح مدیریت شود.','API','اطلاعات ذخیره شوند و پرداخت‌های تأییدنشده پذیرفته نشوند.'),('P0','اتصال درگاه پرداخت','کاربر بتواند پرداخت واقعی انجام دهد.','سیستم پرداخت','درگاه متصل و پرداخت آزمایشی با موفقیت انجام شده باشد.'),('P1','اضافه کردن کانال و پیج','کاربر بتواند به کانال و پیج دسترسی داشته باشد.','صفحه اصلی','لینک‌ها اضافه و تست شده باشند.'),('P1','سیستم گزارش والدین — بخش اول','اطلاعات موردنیاز برای گزارش فعالیت دانش‌آموز جمع‌آوری شود.','ذخیره اطلاعات','ساختار گزارش و داده‌های موردنیاز آماده باشند.'),('P1','سیستم گزارش والدین — بخش دوم','والد بتواند فعالیت یا عدم فعالیت دانش‌آموز را پیگیری کند.','روز 9','گزارش روزانه و پیام عدم ورود دانش‌آموز فعال باشند.'),('P1','اضافه کردن کاراکترهای بیشتر','دانش‌آموز بتواند از میان کاراکترهای بیشتری انتخاب کند.','سیستم کاراکتر','کاراکترهای جدید اضافه و قابل انتخاب باشند.'),('P2','صوتی کردن Chatbot — بخش اول','تعامل اولیه صوتی با Chatbot ایجاد شود.','Chatbot','زیرساخت اولیه Voice آماده باشد.'),('P2','صوتی کردن Chatbot — بخش دوم','تعامل صوتی کامل‌تر با Chatbot امکان‌پذیر شود.','روز 12','قابلیت‌های اصلی Voice کار کنند.'),('—','تست کامل MVP + رفع ایرادات','کاربر بتواند MVP را بدون خطاهای اصلی استفاده کند.','تکمیل قابلیت‌های برنامه','تمام بخش‌های MVP از ابتدا تا انتها تست شده، ایرادات اصلی رفع شده و نسخه آماده ارائه باشد.')]
for i,(p,task,jtbd,dep,dod) in enumerate(data,1): defrows.append([f'روز {i}',p,task,jtbd,'1 روز',dep,dod])
add_heading('Task Definition & Definition of Done')
table(['روز','P','Task','JTBD','زمان','وابستگی','DoD'],defrows,[.55,.35,1.55,2.4,.55,1.4,2.45],7.2)
page_break()
# Tracking
add_heading('Sprint Daily Tracking')
tracking=[[f'روز {i}','', '□','□',''] for i in range(1,15)]
table(['روز','Task','✓ انجام شد','✕ انجام نشد','توضیحات'],tracking,[.9,3.3,1.25,1.25,2.8],9)
add_heading('JTBD & DoD',2)
t=doc.add_table(rows=1,cols=2); t.autofit=False
for i,(a,b) in enumerate([('JTBD\nJob To Be Done','«کاری که کاربر با استفاده از محصول می‌خواهد انجام دهد.»'),('DoD\nDefinition of Done','«معیارهایی که مشخص می‌کنند یک Task واقعاً تمام شده است.»')]):
 c=t.cell(0,i); c.width=Inches(4.75); set_cell_shading(c,'F4FBFE'); set_cell_border(c); add_text(c.paragraphs[0],a,True,11,NAVY,WD_ALIGN_PARAGRAPH.CENTER); add_text(c.add_paragraph(),b,False,9,NAVY,WD_ALIGN_PARAGRAPH.CENTER)
add_heading('MVP FINAL VALIDATION',2)
t=doc.add_table(rows=1,cols=1); c=t.cell(0,0); set_cell_shading(c,'F4FBFE'); set_cell_border(c)
checks=['تمام ۱۶ ویدئو قابل پخش هستند.','تمام تیترها به ویدئوی صحیح متصل هستند.','APIها تست شده‌اند.','چالش‌ها به محتوای صحیح متصل هستند.','آزمون‌ها به محتوای صحیح متصل هستند.','اطلاعات کاربر به درستی ذخیره می‌شود.','پرداخت و اعتبارسنجی پرداخت تست شده است.','درگاه پرداخت تست شده است.','لینک کانال و پیج فعال هستند.','سیستم گزارش والدین تست شده است.','کاراکترهای جدید قابل انتخاب هستند.','Chatbot صوتی تست شده است.','کل مسیر کاربر از ورود تا استفاده از محصول تست شده است.','ایرادات اصلی رفع شده‌اند.','MVP آماده ارائه است.']
for i,x in enumerate(checks):
 p=c.paragraphs[0] if i==0 else c.add_paragraph(); add_text(p,'□ '+x,False,8.5,NAVY)
doc.save(OUT)
print(OUT)
