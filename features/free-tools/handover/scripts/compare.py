import re,sys,json,urllib.request,os
S=sys.argv[1]; slugs=sys.argv[2:]
spec={r['slug']:r for r in json.load(open('/Users/sathyamsahu/Work/personal-projects/traiv/features/free-tools/research/coachway-tool-specs.json'))}
w=lambda h: len(re.sub(r'<script.*?</script>|<style.*?</style>|<[^>]+>',' ',h.split('<body',1)[-1],flags=re.S).split())
for s in slugs:
    h=urllib.request.urlopen(os.environ.get('WEB_ORIGIN','http://localhost:3004')+'/tools/'+s).read().decode()
    ours=w(h); theirs=w(open(S+'/pages/'+s+'.html',encoding='utf-8',errors='ignore').read())
    fq=len(re.findall(r'"@type":"Question"',h)); r=spec[s]
    flags=[('demo','cal.com' in h,r['has_demo']),('prompt','Use this result with ChatGPT' in h,r['has_copy_prompt']),('src','>Sources<' in h,r['has_sources']),('ai','Researching with AI' in h,r['has_ai_research'])]
    bad=[f for f,a,b in flags if a!=b]
    print(f"{s:42} ours {ours:5} cw {theirs:5} {'OK   ' if ours>=theirs else 'SHORT'} {ours-theirs:+5}  faq {fq}/{r['faq_count']} {'flags-ok' if not bad else 'FLAGS:'+','.join(bad)}")
