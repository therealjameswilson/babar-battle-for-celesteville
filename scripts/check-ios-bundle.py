"""Usage: python3 scripts/check-ios-bundle.py /path/to/Babar.app"""
import pathlib, plistlib, sys
root=pathlib.Path(__file__).resolve().parents[1]
bundle=pathlib.Path(sys.argv[1])
info=plistlib.loads((bundle/'Info.plist').read_bytes())
assert info['CFBundleIdentifier']=='com.therealjameswilson.babar'
assert info['CFBundleShortVersionString']=='1.0'
assert info['UIDeviceFamily']==[1]
assert (bundle/info['CFBundleExecutable']).stat().st_size>0
files=[p for p in (root/'dist').rglob('*') if p.is_file() and p.name!='.DS_Store']
for source in files:
    target=bundle/'Client'/source.relative_to(root/'dist')
    assert target.read_bytes()==source.read_bytes(),str(target)
assert (bundle/'Client/native-privacy.html').read_bytes()==(root/'ios/Babar/native-privacy.html').read_bytes()
privacy=plistlib.loads((bundle/'PrivacyInfo.xcprivacy').read_bytes())
assert privacy['NSPrivacyTracking'] is False
assert privacy['NSPrivacyCollectedDataTypes']==[]
assert (bundle/'Assets.car').exists()
print(f'PASS: native iPhone bundle, {len(files)} unchanged client files, bundled privacy and compiled icon assets')
